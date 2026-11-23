# EcoGo — Prototipo web y backend REST

Este archivo contiene el prototipo web de EcoGo y un backend completo con Spring Boot, Spring Data JPA, H2, validaciones, servicios, controladores REST, datos iniciales, pruebas automatizadas y colección Postman.

## Estructura

```text
.
├── index.html                         Prototipo web navegable
├── styles.css                         Estilos responsivos
├── app.js                             Flujo interactivo con datos demo
├── backend/
│   ├── pom.xml                        Dependencias y build Maven
│   ├── src/main/java/com/ecogo/...    Entidades, repositorios, servicios y controladores
│   ├── src/main/resources/            Configuración H2/JPA y Actuator
│   └── src/test/java/com/ecogo/...    Pruebas de integración y reglas de negocio
└── postman/
    ├── EcoGo.postman_collection.json  Requests y tests encadenados
    └── EcoGo-local.postman_environment.json
```

## Ejecutar el backend

Requisitos: Java 17 o superior y Maven 3.8 o superior.

```bash
cd backend
mvn clean test
mvn spring-boot:run
```

La API queda en `http://localhost:8080`. La base de datos H2 se crea en memoria y carga usuarios y solicitudes de demostración al iniciar.

## Ejecutar Postman

1. Importa `postman/EcoGo.postman_collection.json`.
2. Importa `postman/EcoGo-local.postman_environment.json` y selecciónalo.
3. Inicia el backend.
4. Ejecuta la colección completa en orden.

La colección prueba salud, usuarios, creación, consulta, asignación, transición a ruta, completado, filtros, reportes y validación de errores. Los scripts guardan automáticamente el código de la solicitud creada para encadenar las siguientes requests.

## Endpoints incluidos

- `GET /actuator/health`
- `GET /api/usuarios?rol=RECOLECTOR`
- `POST /api/usuarios`
- `GET /api/solicitudes?estado=PENDIENTE&buscar=carton`
- `GET /api/solicitudes/{codigo}`
- `POST /api/solicitudes`
- `PATCH /api/solicitudes/{codigo}/asignar`
- `PATCH /api/solicitudes/{codigo}/estado`
- `GET /api/reportes/resumen`

Consulta `backend/README.md` para el modelo de datos, reglas de negocio y configuración de PostgreSQL.
