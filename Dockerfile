FROM node:18-bullseye-slim AS build
WORKDIR /usr/src/quepasaco_bot
COPY . /usr/src/quepasaco_bot
RUN npm install

FROM gcr.io/distroless/nodejs18-debian11:latest
COPY --from=build /usr/src/quepasaco_bot /usr/src/quepasaco_bot/
WORKDIR /usr/src/quepasaco_bot
CMD ["index.js"]
