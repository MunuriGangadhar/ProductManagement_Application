# Use Node.js 18 Alpine for a lightweight base image
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend ./
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production
EXPOSE 5000
CMD ["node","dist/server.js"]