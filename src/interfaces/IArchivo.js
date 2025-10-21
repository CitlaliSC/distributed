/**
 * Interfaz remota para el servicio de Archivo
 * Define las operaciones disponibles para gestión de archivos
 */
export class IArchivo {
  /**
   * Crea un nuevo archivo en el sistema
   * @param {string} nombre - Nombre del archivo
   * @param {string} contenido - Contenido del archivo
   * @param {string} userId - ID del propietario
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Archivo creado
   */
  async crear(nombre, contenido, userId, token) {
    throw new Error("Método no implementado")
  }

  /**
   * Lee el contenido de un archivo
   * @param {string} archivoId - ID del archivo
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Contenido del archivo
   */
  async leer(archivoId, token) {
    throw new Error("Método no implementado")
  }

  /**
   * Actualiza el contenido de un archivo
   * @param {string} archivoId - ID del archivo
   * @param {string} contenido - Nuevo contenido
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Archivo actualizado
   */
  async actualizar(archivoId, contenido, token) {
    throw new Error("Método no implementado")
  }

  /**
   * Elimina un archivo del sistema
   * @param {string} archivoId - ID del archivo
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async eliminar(archivoId, token) {
    throw new Error("Método no implementado")
  }

  /**
   * Lista todos los archivos de un usuario
   * @param {string} userId - ID del usuario
   * @param {string} token - Token de autenticación
   * @returns {Promise<Array>} Lista de archivos
   */
  async listarArchivos(userId, token) {
    throw new Error("Método no implementado")
  }
}
