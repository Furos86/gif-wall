how to set up your development environment:

don't forget to install:
npm install

start the database:
docker run -p 0.0.0.0:3306:3306 --env MYSQL_ROOT_PASSWORD=pass --name gifwall_database mysql:latest

start the backend:
npm run start-dev:backend

start the frontend:
npm run start-dev:frontend
