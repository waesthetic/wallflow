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
CMD [ "node", ".output/server/index.mjs" ]