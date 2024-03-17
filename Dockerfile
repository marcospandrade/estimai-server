FROM node:18.16.0 AS development

RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
# COPY --chown=node:node prisma ./prisma/

# Install app dependencies
RUN npm i

COPY --chown=node:node . .

USER node

### BUILD ###
FROM node:18.16.0 AS build

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# This line generates the Prisma client code based on the schema defined in the application.
RUN npx prisma generate

RUN npm run build

ENV NODE_ENV production

USER node

### PRODUCTION ###

FROM build AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

WORKDIR /usr/src/app

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
# CMD ["dumb-init", "node", "dist/src/main"]
# CMD [ "node", "--max-old-space-size=8192", "dist/main.js" ]