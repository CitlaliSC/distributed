import { IUsuario } from "../interfaces/IUsuario.js"
import { Usuario } from "../models/Usuario.js"

/**
 * Servicio de Usuario
 * Implementa la interfaz IUsuario para gestión de usuarios
 */
export class UsuarioService extends IUsuario {
  constructor(controladorSeguridad, auditor, nodoId) {
    super()
    this.usuarios = new Map()
    this.controladorSeguridad = controladorSeguridad
    this.auditor = auditor
    this.nodoId = nodoId
  }

  async registrar(username, password, email) {
    // Verificar si el usuario ya existe
    for (const usuario of this.usuarios.values()) {
      if (usuario.username === username) {
        throw new Error("El usuario ya existe")
      }
    }

    const usuario = new Usuario(username, password, email)
    this.usuarios.set(usuario.id, usuario)

    // Registrar evento de auditoría
    await this.auditor.registrarEvento("USUARIO_REGISTRADO", usuario.id, {
      username,
      email,
      nodoOrigen: this.nodoId,
    })

    return usuario.toJSON()
  }

  async autenticar(username, password) {
    let usuario = null

    for (const u of this.usuarios.values()) {
      if (u.username === username) {
        usuario = u
        break
      }
    }

    if (!usuario || !usuario.verificarPassword(password)) {
      await this.auditor.registrarEvento("AUTENTICACION_FALLIDA", "desconocido", {
        username,
        nodoOrigen: this.nodoId,
      })
      throw new Error("Credenciales inválidas")
    }

    const token = await this.controladorSeguridad.generarToken({
      userId: usuario.id,
      username: usuario.username,
    })

    await this.auditor.registrarEvento("AUTENTICACION_EXITOSA", usuario.id, {
      username,
      nodoOrigen: this.nodoId,
    })

    return { token, usuario: usuario.toJSON() }
  }

  async obtenerUsuario(userId, token) {
    await this.controladorSeguridad.validarToken(token)

    const usuario = this.usuarios.get(userId)
    if (!usuario) {
      throw new Error("Usuario no encontrado")
    }

    return usuario.toJSON()
  }

  async listarUsuarios(token) {
    await this.controladorSeguridad.validarToken(token)

    return Array.from(this.usuarios.values()).map((u) => u.toJSON())
  }

  // Método para replicación
  replicarUsuario(usuarioData) {
    const usuario = Usuario.fromJSON(usuarioData)
    this.usuarios.set(usuario.id, usuario)
  }

  // Método para obtener todos los datos (para replicación)
  obtenerTodosLosDatos() {
    return Array.from(this.usuarios.values()).map((u) => ({
      ...u.toJSON(),
      passwordHash: u.passwordHash,
    }))
  }
}
