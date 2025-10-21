import express from "express"
import { BalanceadorCargaService } from "../services/BalanceadorCargaService.js"

const app = express()
app.use(express.json())

const balanceador = new BalanceadorCargaService()

console.log("[BALANCEADOR] Iniciando servidor...")

// ============ RUTAS DE ADMINISTRACIÓN ============

app.post("/api/balanceador/registrar-nodo", async (req, res) => {
  try {
    const { nodoId, url } = req.body
    const resultado = await balanceador.registrarNodo(nodoId, url)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete("/api/balanceador/nodo/:nodoId", async (req, res) => {
  try {
    const { nodoId } = req.params
    const resultado = await balanceador.eliminarNodo(nodoId)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/balanceador/nodos", async (req, res) => {
  try {
    const nodos = await balanceador.obtenerEstadoNodos()
    res.json(nodos)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============ RUTAS PROXY (DISTRIBUIDAS) ============
// Usamos expresiones regulares para capturar rutas dinámicas en Express 5+

app.all(/^\/api\/usuarios\/(.*)/, async (req, res) => {
  try {
    const subpath = req.params[0] || ""
    const resultado = await balanceador.distribuirPeticion({
      method: req.method,
      path: subpath,
      data: req.body,
      headers: req.headers,
    })
    res.json(resultado)
  } catch (error) {
    console.error("[BALANCEADOR][ERROR usuarios]", error)
    res.status(500).json({ error: error.message })
  }
})

app.all(/^\/api\/archivos\/(.*)/, async (req, res) => {
  try {
    const subpath = req.params[0] || ""
    const resultado = await balanceador.distribuirPeticion({
      method: req.method,
      path: subpath,
      data: req.body,
      headers: req.headers,
    })
    res.json(resultado)
  } catch (error) {
    console.error("[BALANCEADOR][ERROR archivos]", error)
    res.status(500).json({ error: error.message })
  }
})

// ============ SERVIDOR Y HEALTH CHECK ============

const PUERTO = 3000
app.listen(PUERTO, () => {
  console.log(`[BALANCEADOR] Servidor escuchando en http://localhost:${PUERTO}`)
  console.log("[BALANCEADOR] Iniciando health check automático...")
  balanceador.iniciarHealthCheck(10000) // Cada 10 segundos
})
