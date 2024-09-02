# build
FROM node:18-alpine AS builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

FROM node:18-alpine

# env vars
ENV NODE_ENV production

ARG USER_ID=1001
ARG GROUP_ID=1001

RUN addgroup -g ${GROUP_ID} nonroot \
    && adduser -D nonroot -u ${USER_ID} -g nonroot -G nonroot -s /bin/sh -h /

COPY --chown=nonroot:nonroot --from=builder /home/node/dist/ /home/nonroot/dist/
COPY --chown=nonroot:nonroot --from=builder /home/node/node_modules/ /home/nonroot/node_modules/ 
COPY --chown=nonroot:nonroot ./package*.json /home/nonroot/

USER nonroot
WORKDIR /home/nonroot 

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
