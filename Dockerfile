# ---- Base Node ----
FROM chekote/node:12.14.1 as base
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

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /data/node_modules ./node_modules
# copy app sources
COPY . .
RUN REACT_APP_DOG_API_ENV="qa" REACT_APP_DOG_API_HOST='https://dog-qa.relaydev.sh' yarn build

#CMD ["/bin/sh"]

FROM nginx AS deploy
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=release /data/build /usr/share/nginx/html
EXPOSE 3030
