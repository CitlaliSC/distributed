import { IBalanceadorCarga } from "../interfaces/IBalanceadorCarga.js"
import axios from "axios"

/**
 * Servicio de Balanceador de Carga
 * Implementa la interfaz IBalanceadorCarga para distribución de peticiones
 */
export class BalanceadorCargaService extends IBalanceadorCarga {
  constructor() {
    super()
    this.nodos = []
    this.indiceActual = 0
    this.intervaloHealthCheck = null
  }

  async registrarNodo(nodoId, url) {
    const nodoExistente = this.nodos.find((n) => n.id === nodoId)

    if (nodoExistente) {
      nodoExistente.url = url
      nodoExistente.activo = true
    } else {
      this.nodos.push({
        id: nodoId,
        url,
        activo: true,
        ultimoHealthCheck: new Date().toISOString(),
        peticiones: 0,
      })
    }

    console.log(`[BALANCEADOR] Nodo registrado: ${nodoId} - ${url}`)
    return { mensaje: "Nodo registrado exitosamente" }
  }

  async eliminarNodo(nodoId) {
    const indice = this.nodos.findIndex((n) => n.id === nodoId)

    if (indice !== -1) {
      this.nodos.splice(indice, 1)
      console.log(`[BALANCEADOR] Nodo eliminado: ${nodoId}`)
      return { mensaje: "Nodo eliminado exitosamente" }
    }

    throw new Error("Nodo no encontrado")
  }

  async obtenerNodoDisponible() {
    const nodosActivos = this.nodos.filter((n) => n.activo)

    if (nodosActivos.length === 0) {
      throw new Error("No hay nodos disponibles")
    }

    // Round Robin
    const nodo = nodosActivos[this.indiceActual % nodosActivos.length]
    this.indiceActual++
    nodo.peticiones++

    return nodo
  }

  async obtenerEstadoNodos() {
    return this.nodos.map((n) => ({
      id: n.id,
      url: n.url,
      activo: n.activo,
      ultimoHealthCheck: n.ultimoHealthCheck,
      peticiones: n.peticiones,
    }))
  }

  async distribuirPeticion(peticion) {
    const nodo = await this.obtenerNodoDisponible()

    try {
      const respuesta = await axios({
        method: peticion.method,
        url: `${nodo.url}${peticion.path}`,
        data: peticion.data,
        headers: peticion.headers,
      })

      return respuesta.data
    } catch (error) {
      console.error(`[BALANCEADOR] Error en nodo ${nodo.id}:`, error.message)

      // Marcar nodo como inactivo
      nodo.activo = false

      // Reintentar con otro nodo
      if (this.nodos.filter((n) => n.activo).length > 0) {
        return this.distribuirPeticion(peticion)
      }

      throw new Error("Todos los nodos están caídos")
    }
  }

  iniciarHealthCheck(intervalo = 10000) {
    this.intervaloHealthCheck = setInterval(async () => {
      console.log("[BALANCEADOR] Ejecutando health check...")

      for (const nodo of this.nodos) {
        try {
          const respuesta = await axios.get(`${nodo.url}/api/nodo/health`, {
            timeout: 5000,
          })

          nodo.activo = true
          nodo.ultimoHealthCheck = new Date().toISOString()
          console.log(`[BALANCEADOR] Nodo ${nodo.id} - OK`)
        } catch (error) {
          nodo.activo = false
          console.error(`[BALANCEADOR] Nodo ${nodo.id} - CAÍDO`)
        }
      }
    }, intervalo)
  }

  detenerHealthCheck() {
    if (this.intervaloHealthCheck) {
      clearInterval(this.intervaloHealthCheck)
    }
  }
}
