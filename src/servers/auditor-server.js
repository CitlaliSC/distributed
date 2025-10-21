import express from "express"
import { AuditorService } from "../services/AuditorService.js"
import { ControladorSeguridadService } from "../services/ControladorSeguridadService.js"

const app = express()
app.use(express.json())

const controladorSeguridad = new ControladorSeguridadService()
const auditor = new AuditorService(controladorSeguridad)

console.log("[AUDITOR] Iniciando servidor de auditoría...")

// ============ RUTAS DE AUDITORÍA ============

app.post("/api/auditoria/evento", async (req, res) => {
  try {
    const { accion, userId, detalles } = req.body
    const evento = await auditor.registrarEvento(accion, userId, detalles)
    res.json(evento)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/auditoria/historial", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")
    const filtros = {
      userId: req.query.userId,
      accion: req.query.accion,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    }
    const historial = await auditor.obtenerHistorial(token, filtros)
    res.json(historial)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get("/api/auditoria/estadisticas", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")
    const estadisticas = await auditor.obtenerEstadisticas(token)
    res.json(estadisticas)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Iniciar servidor
const PUERTO = 4000
app.listen(PUERTO, () => {
  console.log(`[AUDITOR] Servidor escuchando en http://localhost:${PUERTO}`)
  console.log("[AUDITOR] Listo para registrar eventos")
})
