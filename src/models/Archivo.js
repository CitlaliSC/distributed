import { v4 as uuidv4 } from "uuid"

/**
 * Modelo de Archivo
 * Representa un archivo almacenado en el sistema
 */
export class Archivo {
  constructor(nombre, contenido, userId, id = null) {
    this.id = id || uuidv4()
    this.nombre = nombre
    this.contenido = contenido
    this.userId = userId
    this.fechaCreacion = new Date().toISOString()
    this.fechaModificacion = new Date().toISOString()
    this.version = 1
    this.tamaño = contenido ? contenido.length : 0
  }

  /**
   * Actualiza el contenido del archivo
   */
  actualizar(nuevoContenido) {
    this.contenido = nuevoContenido
    this.fechaModificacion = new Date().toISOString()
    this.version += 1
    this.tamaño = nuevoContenido.length
  }

  /**
   * Convierte el archivo a JSON
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      contenido: this.contenido,
      userId: this.userId,
      fechaCreacion: this.fechaCreacion,
      fechaModificacion: this.fechaModificacion,
      version: this.version,
      tamaño: this.tamaño,
    }
  }

  /**
   * Crea un archivo desde un objeto JSON
   */
  static fromJSON(json) {
    const archivo = new Archivo(json.nombre, json.contenido, json.userId, json.id)
    archivo.fechaCreacion = json.fechaCreacion
    archivo.fechaModificacion = json.fechaModificacion
    archivo.version = json.version
    archivo.tamaño = json.tamaño
    return archivo
  }
}
