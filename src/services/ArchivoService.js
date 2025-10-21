import { IArchivo } from "../interfaces/IArchivo.js"
import { Archivo } from "../models/Archivo.js"

/**
 * Servicio de Archivo
 * Implementa la interfaz IArchivo para gestión de archivos
 */
export class ArchivoService extends IArchivo {
  constructor(controladorSeguridad, auditor, nodoId) {
    super()
    this.archivos = new Map()
    this.controladorSeguridad = controladorSeguridad
    this.auditor = auditor
    this.nodoId = nodoId
  }

  async crear(nombre, contenido, userId, token) {
    const userData = await this.controladorSeguridad.validarToken(token)

    if (userData.userId !== userId) {
      throw new Error("No autorizado")
    }

    const archivo = new Archivo(nombre, contenido, userId)
    this.archivos.set(archivo.id, archivo)

    await this.auditor.registrarEvento("ARCHIVO_CREADO", userId, {
      archivoId: archivo.id,
      nombre,
      tamaño: contenido.length,
      nodoOrigen: this.nodoId,
    })

    return archivo.toJSON()
  }

  async leer(archivoId, token) {
    const userData = await this.controladorSeguridad.validarToken(token)

    const archivo = this.archivos.get(archivoId)
    if (!archivo) {
      throw new Error("Archivo no encontrado")
    }

    await this.auditor.registrarEvento("ARCHIVO_LEIDO", userData.userId, {
      archivoId,
      nombre: archivo.nombre,
      nodoOrigen: this.nodoId,
    })

    return archivo.toJSON()
  }

  async actualizar(archivoId, contenido, token) {
    const userData = await this.controladorSeguridad.validarToken(token)

    const archivo = this.archivos.get(archivoId)
    if (!archivo) {
      throw new Error("Archivo no encontrado")
    }

    if (archivo.userId !== userData.userId) {
      throw new Error("No autorizado")
    }

    archivo.actualizar(contenido)

    await this.auditor.registrarEvento("ARCHIVO_ACTUALIZADO", userData.userId, {
      archivoId,
      nombre: archivo.nombre,
      version: archivo.version,
      nodoOrigen: this.nodoId,
    })

    return archivo.toJSON()
  }

  async eliminar(archivoId, token) {
    const userData = await this.controladorSeguridad.validarToken(token)

    const archivo = this.archivos.get(archivoId)
    if (!archivo) {
      throw new Error("Archivo no encontrado")
    }

    if (archivo.userId !== userData.userId) {
      throw new Error("No autorizado")
    }

    this.archivos.delete(archivoId)

    await this.auditor.registrarEvento("ARCHIVO_ELIMINADO", userData.userId, {
      archivoId,
      nombre: archivo.nombre,
      nodoOrigen: this.nodoId,
    })

    return { mensaje: "Archivo eliminado exitosamente" }
  }

  async listarArchivos(userId, token) {
    const userData = await this.controladorSeguridad.validarToken(token)

    if (userData.userId !== userId) {
      throw new Error("No autorizado")
    }

    const archivosUsuario = Array.from(this.archivos.values())
      .filter((a) => a.userId === userId)
      .map((a) => a.toJSON())

    return archivosUsuario
  }

  // Método para replicación
  replicarArchivo(archivoData) {
    const archivo = Archivo.fromJSON(archivoData)
    this.archivos.set(archivo.id, archivo)
  }

  // Método para obtener todos los datos (para replicación)
  obtenerTodosLosDatos() {
    return Array.from(this.archivos.values()).map((a) => a.toJSON())
  }
}
