# ── Backend image ────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching.
COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000

# Run as the built-in non-root user.
USER node

CMD ["node", "src/server.js"]
