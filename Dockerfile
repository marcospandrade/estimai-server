FROM node:18.16.0 AS development

RUN apt update && \
    apt install libssl-dev dumb-init -y --no-install-recommends

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
# COPY --chown=node:node prisma ./prisma/

# Install app dependencies
RUN npm ci

COPY --chown=node:node . .

USER node

### BUILD ###
FROM development AS build

RUN npx prisma generate

RUN npm run build

### PRODUCTION ###
FROM build AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json .
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

COPY ./.env ./

EXPOSE 3001

# CMD ["dumb-init", "node", "dist/src/main"]
CMD [ "npm", "run", "start:migrate:prod" ]