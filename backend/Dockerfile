# Use Node.js 18 Alpine for a lightweight base image
FROM node:18-alpine
WORKDIR /app
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend ./
EXPOSE 5000
CMD ["yarn", "start"]