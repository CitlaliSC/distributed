import { INodo } from "../interfaces/INodo.js"
import axios from "axios"

/**
 * Servicio de Nodo
 * Implementa la interfaz INodo para gestión de nodos distribuidos
 */
export class NodoService extends INodo {
  constructor(nodoId, puerto, usuarioService, archivoService) {
    super()
    this.nodoId = nodoId
    this.puerto = puerto
    this.usuarioService = usuarioService
    this.archivoService = archivoService
    this.estado = "activo"
    this.inicioTiempo = Date.now()
    this.peticionesAtendidas = 0
    this.nodosConocidos = []
  }

  async healthCheck() {
    return {
      nodoId: this.nodoId,
      estado: this.estado,
      puerto: this.puerto,
      tiempoActividad: Date.now() - this.inicioTiempo,
      peticionesAtendidas: this.peticionesAtendidas,
      timestamp: new Date().toISOString(),
    }
  }

  async sincronizar(datos) {
    console.log(`[NODO ${this.nodoId}] Sincronizando datos...`)

    if (datos.usuarios) {
      datos.usuarios.forEach((usuario) => {
        this.usuarioService.replicarUsuario(usuario)
      })
    }

    if (datos.archivos) {
      datos.archivos.forEach((archivo) => {
        this.archivoService.replicarArchivo(archivo)
      })
    }

    return { mensaje: "Sincronización completada" }
  }

  async obtenerMetricas() {
    return {
      nodoId: this.nodoId,
      peticionesAtendidas: this.peticionesAtendidas,
      tiempoActividad: Date.now() - this.inicioTiempo,
      usuariosAlmacenados: this.usuarioService.usuarios.size,
      archivosAlmacenados: this.archivoService.archivos.size,
      memoriaUsada: process.memoryUsage(),
    }
  }

  async replicar(tipo, datos) {
    console.log(`[NODO ${this.nodoId}] Replicando ${tipo}...`)

    if (tipo === "usuario") {
      this.usuarioService.replicarUsuario(datos)
    } else if (tipo === "archivo") {
      this.archivoService.replicarArchivo(datos)
    }

    return { mensaje: "Replicación completada" }
  }

  incrementarPeticiones() {
    this.peticionesAtendidas++
  }

  agregarNodoConocido(nodoUrl) {
    if (!this.nodosConocidos.includes(nodoUrl)) {
      this.nodosConocidos.push(nodoUrl)
    }
  }

  async replicarATodosLosNodos(tipo, datos) {
    const promesas = this.nodosConocidos.map(async (nodoUrl) => {
      try {
        await axios.post(`${nodoUrl}/api/nodo/replicar`, { tipo, datos })
        console.log(`[NODO ${this.nodoId}] Replicado a ${nodoUrl}`)
      } catch (error) {
        console.error(`[NODO ${this.nodoId}] Error replicando a ${nodoUrl}:`, error.message)
      }
    })

    await Promise.allSettled(promesas)
  }
}
