import { IControladorSeguridad } from "../interfaces/IControladorSeguridad.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

/**
 * Servicio de Controlador de Seguridad
 * Implementa la interfaz IControladorSeguridad para gestión de seguridad
 */
export class ControladorSeguridadService extends IControladorSeguridad {
  constructor(secretKey = "clave-secreta-super-segura-cambiar-en-produccion") {
    super()
    this.secretKey = secretKey
    this.tokensRevocados = new Set()
  }

  async validarToken(token) {
    if (!token) {
      throw new Error("Token no proporcionado")
    }

    if (this.tokensRevocados.has(token)) {
      throw new Error("Token revocado")
    }

    try {
      const decoded = jwt.verify(token, this.secretKey)
      return decoded
    } catch (error) {
      throw new Error("Token inválido o expirado")
    }
  }

  async generarToken(payload) {
    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: "24h",
    })
    return token
  }

  async verificarPermiso(userId, recurso, accion) {
    // Implementación básica - en producción sería más compleja
    // Por ahora, todos los usuarios autenticados tienen permisos
    return true
  }

  async encriptar(datos) {
    return bcrypt.hashSync(datos, 10)
  }

  revocarToken(token) {
    this.tokensRevocados.add(token)
  }
}
