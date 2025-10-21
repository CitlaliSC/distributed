import { v4 as uuidv4 } from "uuid"

/**
 * Modelo de Evento de Auditoría
 * Representa un evento registrado en el sistema de auditoría
 */
export class EventoAuditoria {
  constructor(accion, userId, detalles = {}) {
    this.id = uuidv4()
    this.accion = accion
    this.userId = userId
    this.detalles = detalles
    this.timestamp = new Date().toISOString()
    this.nodoOrigen = detalles.nodoOrigen || "desconocido"
  }

  /**
   * Convierte el evento a JSON
   */
  toJSON() {
    return {
      id: this.id,
      accion: this.accion,
      userId: this.userId,
      detalles: this.detalles,
      timestamp: this.timestamp,
      nodoOrigen: this.nodoOrigen,
    }
  }

  /**
   * Crea un evento desde un objeto JSON
   */
  static fromJSON(json) {
    const evento = new EventoAuditoria(json.accion, json.userId, json.detalles)
    evento.id = json.id
    evento.timestamp = json.timestamp
    evento.nodoOrigen = json.nodoOrigen
    return evento
  }
}
