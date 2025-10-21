import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

/**
 * Modelo de Usuario
 * Representa un usuario del sistema con sus credenciales y datos
 */
export class Usuario {
  constructor(username, password, email, id = null) {
    this.id = id || uuidv4()
    this.username = username
    this.passwordHash = null
    this.email = email
    this.fechaCreacion = new Date().toISOString()
    this.activo = true

    if (password) {
      this.setPassword(password)
    }
  }

  /**
   * Establece la contraseña del usuario (hasheada)
   */
  setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password, 10)
  }

  /**
   * Verifica si una contraseña es correcta
   */
  verificarPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash)
  }

  /**
   * Convierte el usuario a un objeto seguro (sin password)
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fechaCreacion: this.fechaCreacion,
      activo: this.activo,
    }
  }

  /**
   * Crea un usuario desde un objeto JSON
   */
  static fromJSON(json) {
    const usuario = new Usuario(json.username, null, json.email, json.id)
    usuario.passwordHash = json.passwordHash
    usuario.fechaCreacion = json.fechaCreacion
    usuario.activo = json.activo
    return usuario
  }
}
