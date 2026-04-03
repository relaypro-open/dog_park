# ---- Base Node ----
FROM docker.io/chekote/node:18.12.1-alpine as base

ARG VITE_DOG_API_ENV="local"
ENV VITE_DOG_API_ENV=$VITE_DOG_API_ENV
ARG VITE_DOG_API_HOST="http://dog"
ENV VITE_DOG_API_HOST=$VITE_DOG_API_HOST

# set working directory
WORKDIR /data
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN mkdir dog_park
RUN yarn install
RUN ls -latr /data

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /data/node_modules ./node_modules
# copy app sources
COPY . .
RUN VITE_DOG_API_ENV=${VITE_DOG_API_ENV} VITE_DOG_API_HOST=${VITE_DOG_API_HOST} yarn build
RUN cd dist; tar -czvf /tmp/dog_park-${VITE_DOG_API_ENV}.tar.gz *

FROM scratch AS tar
COPY --from=release /tmp/dog_park-*.tar.gz /

FROM nginx AS deploy
COPY --from=release /data/dist /usr/share/nginx/html
EXPOSE 3030
