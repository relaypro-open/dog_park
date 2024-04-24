# ---- Base Node ----
FROM chekote/node:10.16.2-alpine as base

ARG REACT_APP_DOG_API_ENV="local" 
ENV REACT_APP_DOG_API_ENV=$REACT_APP_DOG_API_ENV
ARG REACT_APP_DOG_API_HOST="http://dog"
ENV REACT_APP_DOG_API_HOST=$REACT_APP_DOG_API_HOST

# set working director
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
#RUN NODE_OPTIONS=--openssl-legacy-provider REACT_APP_DOG_API_HOST='http://dog' yarn build
#RUN NODE_OPTIONS=--openssl-legacy-provider REACT_APP_DOG_API_ENV=${REACT_APP_DOG_API_ENV} REACT_APP_DOG_API_HOST=${REACT_APP_DOG_API_HOST} yarn build
RUN REACT_APP_DOG_API_ENV=${REACT_APP_DOG_API_ENV} REACT_APP_DOG_API_HOST=${REACT_APP_DOG_API_HOST} yarn build
RUN cd build; tar --exclude="build/service-worker.js" -czvf /tmp/dog_park-${REACT_APP_DOG_API_ENV}.tar.gz *

FROM scratch AS tar
COPY --from=release /tmp/dog_park-*.tar.gz / 


FROM nginx AS deploy
COPY --from=release /data/build /usr/share/nginx/html
EXPOSE 3030
