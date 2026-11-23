# EcoGo Backend — Spring Boot + JPA

Backend REST para el sistema EcoGo de gestión y seguimiento de recolección de materiales reciclables.

## Requisitos

- Java 17 o superior.
- Maven 3.9 o superior.

## Ejecución local

Desde esta carpeta:

```bash
mvn clean spring-boot:run
```

La API queda disponible en `http://localhost:8080`. La aplicación arranca con una base H2 en memoria y carga datos de demostración automáticamente.

Para ejecutar las pruebas:

```bash
mvn clean test
```

Para generar el JAR:

```bash
mvn clean package
java -jar target/ecogo-backend-1.0.0.jar
```

## Endpoints principales

| Método | Endpoint | Propósito |
|---|---|---|
| GET | `/actuator/health` | Estado del servicio |
| GET | `/api/usuarios` | Listar usuarios, opcionalmente por `rol` |
| POST | `/api/usuarios` | Registrar un usuario |
| GET | `/api/solicitudes` | Listar y filtrar solicitudes |
| GET | `/api/solicitudes/{codigo}` | Consultar el detalle y seguimiento |
| POST | `/api/solicitudes` | Crear una solicitud pendiente |
| PATCH | `/api/solicitudes/{codigo}/asignar` | Asignar recolector y fecha |
| PATCH | `/api/solicitudes/{codigo}/estado` | Avanzar el estado del servicio |
| GET | `/api/reportes/resumen` | Obtener estadísticas básicas |

Filtros disponibles en solicitudes: `estado`, `solicitanteId`, `recolectorId` y `buscar`.

## Reglas de negocio implementadas

- Solo un usuario con rol `CIUDADANO` puede crear solicitudes.
- Solo un `RECOLECTOR` activo puede recibir asignaciones.
- El flujo de estados permitido es `PENDIENTE -> ASIGNADA -> EN_CAMINO -> COMPLETADA`.
- Una solicitud no puede completarse sin informar `cantidadRecogidaKg`.
- Las validaciones de entrada responden con HTTP 400 y los errores de negocio con HTTP 409.

## Base de datos

Por defecto se usa H2 en memoria. La consola está disponible en `http://localhost:8080/h2-console` con estos datos:

- JDBC URL: `jdbc:h2:mem:ecogo`
- Usuario: `sa`
- Contraseña: vacía

Para PostgreSQL, reemplaza el driver y las propiedades `spring.datasource` en `src/main/resources/application.yml`, y cambia `ddl-auto` a `validate` después de crear las migraciones.

## Usuarios demo

- Ciudadano: `celia@ecogo.pe` / `ecogo2026` — ID 1.
- Recolector: `juan@ecogo.pe` / `ecogo2026` — ID 2.
- Administrador: `maria@ecogo.pe` / `ecogo2026` — ID 3.
