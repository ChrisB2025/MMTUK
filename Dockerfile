FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/dist ./dist
ENV PORT=3000
EXPOSE $PORT
CMD sh -c "serve dist -l tcp://0.0.0.0:$PORT"
