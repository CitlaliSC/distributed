# Sistema Distribuido de Gestión de Usuarios, Archivos y Auditoría

Sistema distribuido completo para gestionar usuarios, archivos y auditoría en múltiples servidores con acceso concurrente, replicación de datos, autenticación segura y recuperación ante fallos.

## Arquitectura del Sistema

### Componentes Principales

1. **Balanceador de Carga** (Puerto 3000)

   - Distribuye peticiones entre nodos usando Round Robin
   - Monitorea salud de nodos con health checks automáticos
   - Redirige tráfico cuando un nodo falla

2. **Nodos de Aplicación** (Puertos 3001, 3002, 3003)

   - Procesan peticiones de usuarios y archivos
   - Replican datos automáticamente entre sí
   - Mantienen copias sincronizadas de todos los datos

3. **Servidor de Auditoría** (Puerto 4000)
   - Registra todos los eventos del sistema
   - Proporciona historial y estadísticas
   - Centraliza logs de seguridad

### Clases Distribuidas

- **Usuario**: Gestión de usuarios con autenticación
- **Archivo**: Almacenamiento y versionado de archivos
- **Auditor**: Registro de eventos y auditoría
- **Nodo**: Gestión de nodos distribuidos
- **ControladorSeguridad**: Autenticación JWT y permisos
- **BalanceadorCarga**: Distribución de carga y failover

## Seguridad

### Autenticación

- Sistema basado en JWT (JSON Web Tokens)
- Contraseñas hasheadas con bcrypt
- Tokens con expiración de 24 horas
- Validación en cada petición

### Protección de Comunicación

- Tokens Bearer en headers HTTP
- Validación de permisos por recurso
- Auditoría de todos los accesos

## Escalabilidad

### Agregar Nuevos Nodos

1. Iniciar nuevo servidor de nodo en puerto diferente
2. Registrarlo en el balanceador
3. Configurar replicación con nodos existentes
4. El balanceador lo incluirá automáticamente

### Balanceo de Carga

- Algoritmo Round Robin para distribución equitativa
- Health checks cada 10 segundos
- Failover automático a nodos activos

## Tolerancia a Fallos

### Detección de Fallos

- Health checks periódicos del balanceador
- Timeout de 5 segundos por petición
- Marcado automático de nodos caídos

### Replicación de Estado

- Replicación síncrona entre todos los nodos
- Cada operación se replica inmediatamente
- Consistencia eventual garantizada

### Objetos Críticos

- **ControladorSeguridad**: Único, maneja autenticación
- **Auditor**: Único, centraliza logs
- **Usuarios y Archivos**: Replicados en todos los nodos

## Instalación y Ejecución

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn

### Paso 1: Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### Paso 2: Iniciar los Servidores

Necesitas abrir **5 terminales diferentes** y ejecutar cada comando en una terminal separada:

**Terminal 1 - Balanceador de Carga:**
\`\`\`bash
npm run start:balancer
\`\`\`

**Terminal 2 - Nodo 1:**
\`\`\`bash
npm run start:node1
\`\`\`

**Terminal 3 - Nodo 2:**
\`\`\`bash
npm run start:node2
\`\`\`

**Terminal 4 - Nodo 3:**
\`\`\`bash
npm run start:node3
\`\`\`

**Terminal 5 - Servidor de Auditoría:**
\`\`\`bash
npm run start:auditor
\`\`\`

Espera a que todos los servidores estén activos (verás mensajes de confirmación en cada terminal).

### Paso 3: Ejecutar Pruebas

En una **sexta terminal**, ejecuta el cliente de prueba:

\`\`\`bash
npm run test:client
\`\`\`

## 📋 Pruebas Incluidas

El cliente de prueba ejecuta automáticamente:

1.  Registro de nodos en el balanceador
2.  Verificación de estado de nodos
3.  Registro de usuario
4.  Autenticación y generación de token
5.  Creación de múltiples archivos
6.  Listado de archivos del usuario
7.  Verificación de replicación entre nodos
8.  Consulta de estadísticas de auditoría
9.  Simulación de fallo de nodo

## 🔍 Verificación Manual

### Verificar Estado de Nodos

\`\`\`bash
curl http://localhost:3000/api/balanceador/nodos
\`\`\`

### Registrar Usuario

\`\`\`bash
curl -X POST http://localhost:3000/api/usuarios/registrar \
 -H "Content-Type: application/json" \
 -d '{
"username": "maria_garcia",
"password": "segura123",
"email": "maria@example.com"
}'
\`\`\`

### Autenticar Usuario

\`\`\`bash
curl -X POST http://localhost:3000/api/usuarios/autenticar \
 -H "Content-Type: application/json" \
 -d '{
"username": "maria_garcia",
"password": "segura123"
}'
\`\`\`

### Crear Archivo (reemplaza TOKEN y USER_ID)

\`\`\`bash
curl -X POST http://localhost:3000/api/archivos \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer TOKEN" \
 -d '{
"nombre": "mi_archivo.txt",
"contenido": "Contenido del archivo",
"userId": "USER_ID"
}'
\`\`\`

### Ver Métricas de un Nodo

\`\`\`bash
curl http://localhost:3001/api/nodo/metricas
\`\`\`

### Ver Estadísticas de Auditoría (reemplaza TOKEN)

\`\`\`bash
curl http://localhost:4000/api/auditoria/estadisticas \
 -H "Authorization: Bearer TOKEN"
\`\`\`

## 🎯 Características Implementadas

### ✅ Acceso Concurrente

- Múltiples clientes pueden acceder simultáneamente
- Balanceo de carga distribuye peticiones
- Sin bloqueos ni cuellos de botella

### ✅ Replicación de Datos

- Replicación automática entre todos los nodos
- Consistencia eventual
- Sincronización en tiempo real

### ✅ Autenticación Segura

- JWT con expiración
- Contraseñas hasheadas
- Validación en cada operación

### ✅ Recuperación ante Fallos

- Health checks automáticos
- Failover transparente
- Datos replicados previenen pérdida

### ✅ Auditoría Completa

- Registro de todos los eventos
- Estadísticas en tiempo real
- Trazabilidad completa

## 📊 Distribución de Objetos por Servidor

| Servidor    | Puerto | Objetos                                      |
| ----------- | ------ | -------------------------------------------- |
| Balanceador | 3000   | BalanceadorCarga                             |
| Nodo 1      | 3001   | Usuario, Archivo, Nodo, ControladorSeguridad |
| Nodo 2      | 3002   | Usuario, Archivo, Nodo, ControladorSeguridad |
| Nodo 3      | 3003   | Usuario, Archivo, Nodo, ControladorSeguridad |
| Auditor     | 4000   | Auditor, ControladorSeguridad                |

## 🔧 Configuración Avanzada

### Cambiar Intervalo de Health Check

Edita `src/servers/balancer-server.js`:

\`\`\`javascript
balanceador.iniciarHealthCheck(5000); // 5 segundos
\`\`\`

### Cambiar Tiempo de Expiración de Tokens

Edita `src/services/ControladorSeguridadService.js`:

\`\`\`javascript
const token = jwt.sign(payload, this.secretKey, {
expiresIn: '1h' // 1 hora
});
\`\`\`

### Agregar Más Nodos

\`\`\`bash
node src/servers/node-server.js 3004 node4
\`\`\`

Luego registrarlo:

\`\`\`bash
curl -X POST http://localhost:3000/api/balanceador/registrar-nodo \
 -H "Content-Type: application/json" \
 -d '{
"nodoId": "node4",
"url": "http://localhost:3004"
}'
\`\`\`

## 🐛 Solución de Problemas

### Error: "No hay nodos disponibles"

- Verifica que los nodos estén iniciados
- Revisa que estén registrados en el balanceador
- Espera al próximo health check (10 segundos)

### Error: "Token inválido"

- Verifica que el token no haya expirado
- Asegúrate de incluir "Bearer " antes del token
- Genera un nuevo token autenticándote

### Los datos no se replican

- Verifica que los nodos estén configurados entre sí
- Revisa los logs de cada nodo
- Asegúrate de que todos los nodos estén activos

## 📝 Notas Adicionales

- El sistema usa almacenamiento en memoria (Map)
- En producción, usar base de datos persistente
- Los tokens se generan con clave secreta fija (cambiar en producción)
- Health checks pueden ajustarse según necesidades
- La replicación es síncrona para garantizar consistencia

## 🎓 Conceptos Demostrados

1. **Interfaces Remotas**: Cada clase tiene su interfaz definida
2. **Comunicación HTTP/REST**: Objetos se comunican vía API
3. **Balanceo de Carga**: Round Robin con failover
4. **Replicación**: Datos sincronizados entre nodos
5. **Seguridad**: JWT, bcrypt, validación de permisos
6. **Auditoría**: Registro completo de eventos
7. **Tolerancia a Fallos**: Health checks y recuperación automática
8. **Escalabilidad**: Agregar nodos dinámicamente

---

**Desarrollado como sistema distribuido educativo completo** 🚀
