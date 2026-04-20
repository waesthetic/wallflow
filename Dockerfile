FROM node:22-slim AS builder
WORKDIR /app
ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodejs
USER nodejs
COPY --from=builder /app/.output ./.output
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD [ "node", ".output/server/index.mjs" ]