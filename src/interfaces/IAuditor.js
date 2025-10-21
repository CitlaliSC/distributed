/**
 * Interfaz remota para el servicio de Auditoría
 * Define las operaciones disponibles para auditoría del sistema
 */
export class IAuditor {
  /**
   * Registra un evento de auditoría
   * @param {string} accion - Acción realizada
   * @param {string} userId - ID del usuario que realizó la acción
   * @param {Object} detalles - Detalles adicionales del evento
   * @returns {Promise<Object>} Evento registrado
   */
  async registrarEvento(accion, userId, detalles) {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene el historial de auditoría
   * @param {string} token - Token de autenticación
   * @param {Object} filtros - Filtros opcionales (userId, accion, fecha)
   * @returns {Promise<Array>} Lista de eventos de auditoría
   */
  async obtenerHistorial(token, filtros) {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene estadísticas de uso del sistema
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Estadísticas del sistema
   */
  async obtenerEstadisticas(token) {
    throw new Error("Método no implementado")
  }
}
