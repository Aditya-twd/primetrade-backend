# ── Backend image ────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching. `npm ci` is reproducible (uses
# the committed lockfile) and `--omit=dev` keeps the production image small.
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000

# Run as the built-in non-root user.
USER node

CMD ["node", "src/server.js"]
