FROM node:14-alpine
ENV NODE_ENV=production PORT=8080
WORKDIR /user/src/app
COPY . .
RUN npm i
EXPOSE 8080
CMD ["npm", "start"]