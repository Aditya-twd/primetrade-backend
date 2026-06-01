# Primetrade.ai — Backend API

Scalable REST API with JWT authentication, role-based access control (RBAC), and
CRUD for a **Tasks** entity. Built with **Node.js + Express + MongoDB (Mongoose)**.

## Features
- Register / Login / Refresh / Logout — bcrypt hashing + JWT (access token + httpOnly refresh cookie)
- Role-based access: `user` and `admin`
- Full CRUD for Tasks (ownership-scoped; admins see all and the task owner's name/email)
- API versioning under `/api/v1`, centralized error handling, request validation
- Security: helmet, CORS allow-list, rate limiting, NoSQL-injection sanitization
- Interactive **Swagger** docs at `/api/v1/docs`
- Integration tests (Jest + Supertest)

## Quick start
```bash
cp .env.example .env      # then set MONGO_URI + JWT secrets
npm install
npm run dev               # http://localhost:5000
```

No local Mongo? Either use MongoDB Atlas (set `MONGO_URI`) or run one with Docker:
```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

A default admin is seeded on first boot: `admin@primetrade.ai` / `Admin@12345`
(configurable via `SEED_ADMIN_*`).

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm start` | Start (production) |
| `npm test` | Run tests (in-memory MongoDB) |

## Environment
See [`.env.example`](./.env.example) for all variables (`MONGO_URI`, `JWT_*`, `CORS_ORIGIN`, `SEED_ADMIN_*`).

## Deployment
- Stateless API → run multiple replicas behind a load balancer.
- Set production secrets via the host's environment (never commit `.env`).
- A `Dockerfile` is included; build with `docker build -t primetrade-api .`.
- Health check for probes: `GET /api/v1/health`.

## API reference
Run the server and open **`/api/v1/docs`** (Swagger UI) for the full, interactive reference.
