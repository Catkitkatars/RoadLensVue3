FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm config set package-lock false
RUN npm install
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "local"]
