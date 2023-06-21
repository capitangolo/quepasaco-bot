FROM node:18-bullseye-slim AS build
WORKDIR /usr/src/pasaco-bot
COPY . /usr/src/pasaco-bot
RUN ./build.sh

FROM gcr.io/distroless/nodejs18-debian11:latest
COPY --from=build /usr/src/pasaco-bot /usr/pasaco-bot_backend
WORKDIR /usr/src/pasaco-bot_backend
CMD ["npm", "run", "start"]
