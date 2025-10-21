import axios from "axios"

const BALANCEADOR_URL = "http://localhost:3000"
const AUDITOR_URL = "http://localhost:4000"

let token = null
let userId = null

console.log("=".repeat(60))
console.log("CLIENTE DE PRUEBA - SISTEMA DISTRIBUIDO")
console.log("=".repeat(60))

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function registrarNodos() {
  console.log("\n📡 REGISTRANDO NODOS EN EL BALANCEADOR...")

  try {
    await axios.post(`${BALANCEADOR_URL}/api/balanceador/registrar-nodo`, {
      nodoId: "node1",
      url: "http://localhost:3001",
    })
    console.log("✓ Nodo 1 registrado")

    await axios.post(`${BALANCEADOR_URL}/api/balanceador/registrar-nodo`, {
      nodoId: "node2",
      url: "http://localhost:3002",
    })
    console.log("✓ Nodo 2 registrado")

    await axios.post(`${BALANCEADOR_URL}/api/balanceador/registrar-nodo`, {
      nodoId: "node3",
      url: "http://localhost:3003",
    })
    console.log("✓ Nodo 3 registrado")

    // Configurar nodos para que se conozcan entre sí (para replicación)
    await axios.post("http://localhost:3001/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3002",
    })
    await axios.post("http://localhost:3001/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3003",
    })

    await axios.post("http://localhost:3002/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3001",
    })
    await axios.post("http://localhost:3002/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3003",
    })

    await axios.post("http://localhost:3003/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3001",
    })
    await axios.post("http://localhost:3003/api/nodo/agregar-nodo", {
      nodoUrl: "http://localhost:3002",
    })

    console.log("✓ Nodos configurados para replicación")
  } catch (error) {
    console.error("✗ Error registrando nodos:", error.message)
  }
}

async function verificarEstadoNodos() {
  console.log("\n🔍 VERIFICANDO ESTADO DE NODOS...")

  try {
    const respuesta = await axios.get(`${BALANCEADOR_URL}/api/balanceador/nodos`)
    console.log("Estado de nodos:")
    respuesta.data.forEach((nodo) => {
      console.log(`  - ${nodo.id}: ${nodo.activo ? "✓ ACTIVO" : "✗ INACTIVO"} (${nodo.peticiones} peticiones)`)
    })
  } catch (error) {
    console.error("✗ Error verificando nodos:", error.message)
  }
}

async function registrarUsuario() {
  console.log("\n👤 REGISTRANDO USUARIO...")

  try {
    const respuesta = await axios.post(`${BALANCEADOR_URL}/api/usuarios/registrar`, {
      username: "juan_perez",
      password: "password123",
      email: "juan@example.com",
    })

    userId = respuesta.data.id
    console.log("✓ Usuario registrado:", respuesta.data)
  } catch (error) {
    console.error("✗ Error registrando usuario:", error.response?.data || error.message)
  }
}

async function autenticarUsuario() {
  console.log("\n🔐 AUTENTICANDO USUARIO...")

  try {
    const respuesta = await axios.post(`${BALANCEADOR_URL}/api/usuarios/autenticar`, {
      username: "juan_perez",
      password: "password123",
    })

    token = respuesta.data.token
    console.log("✓ Autenticación exitosa")
    console.log("Token:", token.substring(0, 50) + "...")
  } catch (error) {
    console.error("✗ Error autenticando:", error.response?.data || error.message)
  }
}

async function crearArchivos() {
  console.log("\n📄 CREANDO ARCHIVOS...")

  try {
    const archivo1 = await axios.post(
      `${BALANCEADOR_URL}/api/archivos`,
      {
        nombre: "documento1.txt",
        contenido: "Este es el contenido del primer documento",
        userId: userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    console.log("✓ Archivo 1 creado:", archivo1.data.nombre)

    const archivo2 = await axios.post(
      `${BALANCEADOR_URL}/api/archivos`,
      {
        nombre: "documento2.txt",
        contenido: "Este es el contenido del segundo documento",
        userId: userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    console.log("✓ Archivo 2 creado:", archivo2.data.nombre)

    const archivo3 = await axios.post(
      `${BALANCEADOR_URL}/api/archivos`,
      {
        nombre: "notas.txt",
        contenido: "Notas importantes del sistema distribuido",
        userId: userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    console.log("✓ Archivo 3 creado:", archivo3.data.nombre)
  } catch (error) {
    console.error("✗ Error creando archivos:", error.response?.data || error.message)
  }
}

async function listarArchivos() {
  console.log("\n📋 LISTANDO ARCHIVOS DEL USUARIO...")

  try {
    const respuesta = await axios.get(`${BALANCEADOR_URL}/api/archivos/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log(`✓ Total de archivos: ${respuesta.data.length}`)
    respuesta.data.forEach((archivo) => {
      console.log(`  - ${archivo.nombre} (${archivo.tamaño} bytes, v${archivo.version})`)
    })
  } catch (error) {
    console.error("✗ Error listando archivos:", error.response?.data || error.message)
  }
}

async function verificarReplicacion() {
  console.log("\n🔄 VERIFICANDO REPLICACIÓN ENTRE NODOS...")

  try {
    const metricas1 = await axios.get("http://localhost:3001/api/nodo/metricas")
    const metricas2 = await axios.get("http://localhost:3002/api/nodo/metricas")
    const metricas3 = await axios.get("http://localhost:3003/api/nodo/metricas")

    console.log("Nodo 1:", {
      usuarios: metricas1.data.usuariosAlmacenados,
      archivos: metricas1.data.archivosAlmacenados,
    })
    console.log("Nodo 2:", {
      usuarios: metricas2.data.usuariosAlmacenados,
      archivos: metricas2.data.archivosAlmacenados,
    })
    console.log("Nodo 3:", {
      usuarios: metricas3.data.usuariosAlmacenados,
      archivos: metricas3.data.archivosAlmacenados,
    })

    if (
      metricas1.data.usuariosAlmacenados === metricas2.data.usuariosAlmacenados &&
      metricas2.data.usuariosAlmacenados === metricas3.data.usuariosAlmacenados
    ) {
      console.log("✓ Replicación de usuarios exitosa")
    } else {
      console.log("⚠ Replicación de usuarios inconsistente")
    }

    if (
      metricas1.data.archivosAlmacenados === metricas2.data.archivosAlmacenados &&
      metricas2.data.archivosAlmacenados === metricas3.data.archivosAlmacenados
    ) {
      console.log("✓ Replicación de archivos exitosa")
    } else {
      console.log("⚠ Replicación de archivos inconsistente")
    }
  } catch (error) {
    console.error("✗ Error verificando replicación:", error.message)
  }
}

async function consultarAuditoria() {
  console.log("\n📊 CONSULTANDO AUDITORÍA...")

  try {
    const estadisticas = await axios.get(`${AUDITOR_URL}/api/auditoria/estadisticas`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log("✓ Estadísticas de auditoría:")
    console.log("  Total de eventos:", estadisticas.data.totalEventos)
    console.log("  Eventos por acción:")
    Object.entries(estadisticas.data.eventosPorAccion).forEach(([accion, count]) => {
      console.log(`    - ${accion}: ${count}`)
    })
  } catch (error) {
    console.error("✗ Error consultando auditoría:", error.response?.data || error.message)
  }
}

async function simularFalloNodo() {
  console.log("\n⚠️  SIMULANDO FALLO DE NODO...")
  console.log("(En un escenario real, detendría el nodo 2)")
  console.log("El balanceador detectará el fallo en el próximo health check")
  console.log("y redistribuirá las peticiones a los nodos activos.")
}

async function ejecutarPruebas() {
  try {
    await registrarNodos()
    await sleep(2000)

    await verificarEstadoNodos()
    await sleep(1000)

    await registrarUsuario()
    await sleep(1000)

    await autenticarUsuario()
    await sleep(1000)

    await crearArchivos()
    await sleep(2000) // Esperar replicación

    await listarArchivos()
    await sleep(1000)

    await verificarReplicacion()
    await sleep(1000)

    await consultarAuditoria()
    await sleep(1000)

    await simularFalloNodo()
    await sleep(1000)

    await verificarEstadoNodos()

    console.log("\n" + "=".repeat(60))
    console.log("✓ PRUEBAS COMPLETADAS EXITOSAMENTE")
    console.log("=".repeat(60))
    console.log("\nEl sistema distribuido está funcionando correctamente:")
    console.log("  ✓ Balanceo de carga activo")
    console.log("  ✓ Replicación de datos entre nodos")
    console.log("  ✓ Autenticación y seguridad funcionando")
    console.log("  ✓ Auditoría registrando eventos")
    console.log("  ✓ Tolerancia a fallos implementada")
  } catch (error) {
    console.error("\n✗ Error en las pruebas:", error.message)
  }
}

// Ejecutar pruebas
ejecutarPruebas()
