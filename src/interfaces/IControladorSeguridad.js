/**
 * Interfaz remota para el servicio de Seguridad
 * Define las operaciones disponibles para control de seguridad
 */
export class IControladorSeguridad {
  /**
   * Valida un token de autenticación
   * @param {string} token - Token a validar
   * @returns {Promise<Object>} Datos del usuario si el token es válido
   */
  async validarToken(token) {
    throw new Error("Método no implementado")
  }

  /**
   * Genera un nuevo token de autenticación
   * @param {Object} payload - Datos a incluir en el token
   * @returns {Promise<string>} Token generado
   */
  async generarToken(payload) {
    throw new Error("Método no implementado")
  }

  /**
   * Verifica permisos de un usuario para una acción
   * @param {string} userId - ID del usuario
   * @param {string} recurso - Recurso al que se intenta acceder
   * @param {string} accion - Acción a realizar
   * @returns {Promise<boolean>} true si tiene permiso
   */
  async verificarPermiso(userId, recurso, accion) {
    throw new Error("Método no implementado")
  }

  /**
   * Encripta datos sensibles
   * @param {string} datos - Datos a encriptar
   * @returns {Promise<string>} Datos encriptados
   */
  async encriptar(datos) {
    throw new Error("Método no implementado")
  }
}
