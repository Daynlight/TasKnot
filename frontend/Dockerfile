FROM node:20-alpine AS base
USER node
WORKDIR /home/node

# --- Dependencies
FROM base AS deps
COPY --chown=node:node package*.json ./
RUN npm ci

# --- Development
FROM base AS development
ENV NODE_ENV=development
COPY --chown=node:node . .
CMD ["sh", "-c", "npm install && npm run dev"]

# --- Production
FROM base AS builder
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=deps /home/node/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build

FROM node:20-alpine AS production
USER node
WORKDIR /home/node
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
COPY --from=builder --chown=node:node /home/node/public ./public
COPY --from=builder --chown=node:node /home/node/.next/standalone ./
COPY --from=builder --chown=node:node /home/node/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
