/**
 * Interfaz remota para el servicio de Usuario
 * Define las operaciones disponibles para gestión de usuarios
 */
export class IUsuario {
  /**
   * Registra un nuevo usuario en el sistema
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async registrar(username, password, email) {
    throw new Error("Método no implementado")
  }

  /**
   * Autentica un usuario y genera un token
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Token de autenticación
   */
  async autenticar(username, password) {
    throw new Error("Método no implementado")
  }

  /**
   * Obtiene información de un usuario
   * @param {string} userId - ID del usuario
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Datos del usuario
   */
  async obtenerUsuario(userId, token) {
    throw new Error("Método no implementado")
  }

  /**
   * Lista todos los usuarios del sistema
   * @param {string} token - Token de autenticación
   * @returns {Promise<Array>} Lista de usuarios
   */
  async listarUsuarios(token) {
    throw new Error("Método no implementado")
  }
}
