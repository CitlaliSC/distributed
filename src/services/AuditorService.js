import { IAuditor } from "../interfaces/IAuditor.js"
import { EventoAuditoria } from "../models/EventoAuditoria.js"

/**
 * Servicio de Auditoría
 * Implementa la interfaz IAuditor para registro y consulta de eventos
 */
export class AuditorService extends IAuditor {
  constructor(controladorSeguridad) {
    super()
    this.eventos = []
    this.controladorSeguridad = controladorSeguridad
  }

  async registrarEvento(accion, userId, detalles = {}) {
    const evento = new EventoAuditoria(accion, userId, detalles)
    this.eventos.push(evento)

    console.log(`[AUDITOR] ${evento.timestamp} - ${accion} - Usuario: ${userId}`)

    return evento.toJSON()
  }

  async obtenerHistorial(token, filtros = {}) {
    await this.controladorSeguridad.validarToken(token)

    let eventosFiltrados = [...this.eventos]

    if (filtros.userId) {
      eventosFiltrados = eventosFiltrados.filter((e) => e.userId === filtros.userId)
    }

    if (filtros.accion) {
      eventosFiltrados = eventosFiltrados.filter((e) => e.accion === filtros.accion)
    }

    if (filtros.fechaInicio) {
      eventosFiltrados = eventosFiltrados.filter((e) => new Date(e.timestamp) >= new Date(filtros.fechaInicio))
    }

    if (filtros.fechaFin) {
      eventosFiltrados = eventosFiltrados.filter((e) => new Date(e.timestamp) <= new Date(filtros.fechaFin))
    }

    return eventosFiltrados.map((e) => e.toJSON())
  }

  async obtenerEstadisticas(token) {
    await this.controladorSeguridad.validarToken(token)

    const estadisticas = {
      totalEventos: this.eventos.length,
      eventosPorAccion: {},
      eventosPorUsuario: {},
      eventosPorNodo: {},
    }

    this.eventos.forEach((evento) => {
      // Contar por acción
      estadisticas.eventosPorAccion[evento.accion] = (estadisticas.eventosPorAccion[evento.accion] || 0) + 1

      // Contar por usuario
      estadisticas.eventosPorUsuario[evento.userId] = (estadisticas.eventosPorUsuario[evento.userId] || 0) + 1

      // Contar por nodo
      estadisticas.eventosPorNodo[evento.nodoOrigen] = (estadisticas.eventosPorNodo[evento.nodoOrigen] || 0) + 1
    })

    return estadisticas
  }
}
