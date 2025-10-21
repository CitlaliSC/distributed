/**
 * Interfaz remota para el servicio de Nodo
 * Define las operaciones disponibles para gestión de nodos
 */
export class INodo {
  /**
   * Verifica el estado de salud del nodo
   * @returns {Promise<Object>} Estado del nodo
   */
  async healthCheck() {
    throw new Error("Método no implementado")
  }

  /**
   * Sincroniza datos con otros nodos
   * @param {Object} datos - Datos a sincronizar
   * @returns {Promise<Object>} Confirmación de sincronización
   */
  async sincronizar(datos) {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene métricas del nodo
   * @returns {Promise<Object>} Métricas de rendimiento
   */
  async obtenerMetricas() {
    throw new Error("Método no implementado")
  }

  /**
   * Replica datos hacia este nodo
   * @param {string} tipo - Tipo de dato (usuario, archivo)
   * @param {Object} datos - Datos a replicar
   * @returns {Promise<Object>} Confirmación de replicación
   */
  async replicar(tipo, datos) {
    throw new Error("Método no implementado")
  }
}
