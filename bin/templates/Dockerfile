FROM node:12-alpine

RUN apk add --update-cache --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  apk del native-deps && \
  rm -rf /var/cache/apk/*

WORKDIR /app
COPY ./package-lock.json /app/package-lock.json
COPY ./package.json      /app/package.json

RUN npm install --unsafe-perm

COPY ./migrations        /app/migrations
COPY ./src               /app/src
COPY ./entrypoint.sh     /app/entrypoint.sh
COPY ./gatsby-browser.js /app/gatsby-browser.js
COPY ./gatsby-config.js  /app/gatsby-config.js
COPY ./gatsby-node.js    /app/gatsby-node.js
COPY ./gatsby-ssr.js     /app/gatsby-ssr.js
COPY ./gatsby-ssr.js     /app/gatsby-ssr.js
COPY ./tsconfig.json     /app/tsconfig.json
COPY ./.env.*            /app/

RUN npm run build

ENTRYPOINT [ "./entrypoint.sh" ]