const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "Full Stack Task Manager — REST API con autenticacion JWT y gestion de tareas por usuario. " +
        "Arquitectura Hexagonal: Domain / Application / Infrastructure.",
    },
    servers: [
      {
        url: "https://task-manager-backend-omega.vercel.app",
        description: "Produccion (Vercel + Neon PostgreSQL)",
      },
      {
        url: "http://localhost:3000",
        description: "Desarrollo local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenido desde POST /login",
        },
      },
      schemas: {
        Task: {
          type: "object",
          properties: {
            id:        { type: "integer", example: 1 },
            text:      { type: "string",  example: "Estudiar Prisma ORM" },
            completed: { type: "boolean", example: false },
            userId:    { type: "integer", example: 3 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id:    { type: "integer", example: 1 },
            name:  { type: "string",  example: "Matias" },
            email: { type: "string",  example: "matias@test.com" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Invalid credentials" },
          },
        },
      },
    },
    tags: [
      { name: "Auth",  description: "Registro, login y perfil de usuario" },
      { name: "Tasks", description: "CRUD de tareas — requiere Bearer token" },
    ],
    paths: {
      "/register": {
        post: {
          tags: ["Auth"],
          summary: "Registrar nuevo usuario",
          description: "Crea un usuario real en PostgreSQL. La contrasena se hashea con bcrypt (10 rondas) antes de guardar.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name:     { type: "string",  example: "User One" },
                    email:    { type: "string",  example: "user1@test.com" },
                    password: { type: "string",  example: "password1" },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Usuario creado exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User registered successfully" },
                      user:    { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "409": { description: "Email ya en uso", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "400": { description: "Datos invalidos",  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Iniciar sesion y obtener JWT",
          description: "Verifica email y contrasena contra PostgreSQL usando bcrypt.compare. Devuelve un token JWT valido por 1 hora.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email:    { type: "string", example: "user1@test.com" },
                    password: { type: "string", example: "password1" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login exitoso — incluye JWT",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    },
                  },
                },
              },
            },
            "401": { description: "Credenciales invalidas", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/profile": {
        get: {
          tags: ["Auth"],
          summary: "Obtener perfil (ruta protegida)",
          description: "Demuestra que el token JWT funciona. Devuelve el payload decodificado del token.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Perfil del usuario autenticado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Protected profile data" },
                      user:    { type: "object" },
                    },
                  },
                },
              },
            },
            "401": { description: "Token ausente o invalido", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Obtener tareas del usuario autenticado",
          description: "Filtra las tareas por userId extraido del JWT. Cada usuario solo ve sus propias tareas.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Lista de tareas del usuario",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Task" } },
                },
              },
            },
            "401": { description: "Sin token o token invalido", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Crear nueva tarea",
          description: "Crea una tarea asignada al usuario del token JWT.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["text"],
                  properties: {
                    text: { type: "string", example: "Estudiar arquitectura hexagonal" },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Tarea creada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } },
            },
            "400": { description: "Texto requerido", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "401": { description: "Sin token",       content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/tasks/{id}": {
        put: {
          tags: ["Tasks"],
          summary: "Actualizar tarea (toggle completed / editar texto)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    completed: { type: "boolean", example: true },
                    text:      { type: "string",  example: "Texto actualizado" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Tarea actualizada", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } },
            "404": { description: "Tarea no encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "401": { description: "Sin token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Eliminar tarea",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 }],
          responses: {
            "200": {
              description: "Tarea eliminada",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string", example: "Task deleted" } } } } },
            },
            "404": { description: "Tarea no encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "401": { description: "Sin token", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
