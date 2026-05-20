FROM node:20-alpine

# c'est une valeur par défaut mais elle peut être écrasée
ARG APP_PORT=3000
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

# Utilisation de la variable d'environnement
EXPOSE ${APP_PORT}

RUN chown -R node:node /app
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${APP_PORT}/healthz || exit 1

CMD ["node", "index.js"]