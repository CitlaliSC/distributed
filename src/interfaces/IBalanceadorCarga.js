/**
 * Interfaz remota para el servicio de Balanceador de Carga
 * Define las operaciones disponibles para balanceo de carga
 */
export class IBalanceadorCarga {
  /**
   * Registra un nuevo nodo en el balanceador
   * @param {string} nodoId - ID del nodo
   * @param {string} url - URL del nodo
   * @returns {Promise<Object>} Confirmación de registro
   */
  async registrarNodo(nodoId, url) {
    throw new Error("Método no implementado")
  }

  /**
   * Elimina un nodo del balanceador
   * @param {string} nodoId - ID del nodo
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async eliminarNodo(nodoId) {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene el siguiente nodo disponible (Round Robin)
   * @returns {Promise<Object>} Nodo seleccionado
   */
  async obtenerNodoDisponible() {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene el estado de todos los nodos
   * @returns {Promise<Array>} Lista de nodos con su estado
   */
  async obtenerEstadoNodos() {
    throw new Error("Método no implementado")
  }

  /**
   * Distribuye una petición al nodo más apropiado
   * @param {Object} peticion - Petición a distribuir
   * @returns {Promise<Object>} Respuesta del nodo
   */
  async distribuirPeticion(peticion) {
    throw new Error("Método no implementado")
  }
}
