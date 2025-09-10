# Stage 1: Build the React frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend ./
RUN yarn build

# Stage 2: Serve the frontend with a lightweight server
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]