import express from "express"
import { UsuarioService } from "../services/UsuarioService.js"
import { ArchivoService } from "../services/ArchivoService.js"
import { AuditorService } from "../services/AuditorService.js"
import { ControladorSeguridadService } from "../services/ControladorSeguridadService.js"
import { NodoService } from "../services/NodoService.js"

const puerto = process.argv[2] || 3001
const nodoId = process.argv[3] || `node${puerto}`

const app = express()
app.use(express.json())

// Inicializar servicios
const controladorSeguridad = new ControladorSeguridadService()
const auditor = new AuditorService(controladorSeguridad)
const usuarioService = new UsuarioService(controladorSeguridad, auditor, nodoId)
const archivoService = new ArchivoService(controladorSeguridad, auditor, nodoId)
const nodoService = new NodoService(nodoId, puerto, usuarioService, archivoService)

console.log(`[NODO ${nodoId}] Iniciando en puerto ${puerto}...`)

// ============ RUTAS DE USUARIO ============

app.post("/api/usuarios/registrar", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { username, password, email } = req.body
    const usuario = await usuarioService.registrar(username, password, email)

    // Replicar a otros nodos
    await nodoService.replicarATodosLosNodos("usuario", {
      ...usuario,
      passwordHash: usuarioService.usuarios.get(usuario.id).passwordHash,
    })

    res.json(usuario)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post("/api/usuarios/autenticar", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { username, password } = req.body
    const resultado = await usuarioService.autenticar(username, password)
    res.json(resultado)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

app.get("/api/usuarios/:userId", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { userId } = req.params
    const token = req.headers.authorization?.replace("Bearer ", "")
    const usuario = await usuarioService.obtenerUsuario(userId, token)
    res.json(usuario)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/usuarios", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const token = req.headers.authorization?.replace("Bearer ", "")
    const usuarios = await usuarioService.listarUsuarios(token)
    res.json(usuarios)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============ RUTAS DE ARCHIVO ============

app.post("/api/archivos", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { nombre, contenido, userId } = req.body
    const token = req.headers.authorization?.replace("Bearer ", "")
    const archivo = await archivoService.crear(nombre, contenido, userId, token)

    // Replicar a otros nodos
    await nodoService.replicarATodosLosNodos("archivo", archivo)

    res.json(archivo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/archivos/:archivoId", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { archivoId } = req.params
    const token = req.headers.authorization?.replace("Bearer ", "")
    const archivo = await archivoService.leer(archivoId, token)
    res.json(archivo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put("/api/archivos/:archivoId", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { archivoId } = req.params
    const { contenido } = req.body
    const token = req.headers.authorization?.replace("Bearer ", "")
    const archivo = await archivoService.actualizar(archivoId, contenido, token)

    // Replicar a otros nodos
    await nodoService.replicarATodosLosNodos("archivo", archivo)

    res.json(archivo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete("/api/archivos/:archivoId", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { archivoId } = req.params
    const token = req.headers.authorization?.replace("Bearer ", "")
    const resultado = await archivoService.eliminar(archivoId, token)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/archivos/usuario/:userId", async (req, res) => {
  try {
    nodoService.incrementarPeticiones()
    const { userId } = req.params
    const token = req.headers.authorization?.replace("Bearer ", "")
    const archivos = await archivoService.listarArchivos(userId, token)
    res.json(archivos)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============ RUTAS DE NODO ============

app.get("/api/nodo/health", async (req, res) => {
  try {
    const estado = await nodoService.healthCheck()
    res.json(estado)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/nodo/metricas", async (req, res) => {
  try {
    const metricas = await nodoService.obtenerMetricas()
    res.json(metricas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/nodo/sincronizar", async (req, res) => {
  try {
    const { datos } = req.body
    const resultado = await nodoService.sincronizar(datos)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post("/api/nodo/replicar", async (req, res) => {
  try {
    const { tipo, datos } = req.body
    const resultado = await nodoService.replicar(tipo, datos)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post("/api/nodo/agregar-nodo", async (req, res) => {
  try {
    const { nodoUrl } = req.body
    nodoService.agregarNodoConocido(nodoUrl)
    res.json({ mensaje: "Nodo agregado a la lista de nodos conocidos" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`[NODO ${nodoId}] Servidor escuchando en http://localhost:${puerto}`)
  console.log(`[NODO ${nodoId}] Listo para recibir peticiones`)
})
