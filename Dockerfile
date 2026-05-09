FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN chmod +x ./node_modules/.bin/nest && npm run build

FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "dist/main"]
