/* eslint-disable @typescript-eslint/no-var-requires */
import { Application } from "./game/Application";

const express = require("express");
const { Server } = require("socket.io");
const cors = require('cors')
const http = require('http');


const PORT = process.env.PORT || 3000;
const CLIENT_HOST = process.env.CLIENT_HOST || /localhost:[0-9]+/;
const LUMI_HOST = process.env.LUMI_HOST;

console.log(`client host ${CLIENT_HOST}`);
console.log(`web host ${LUMI_HOST}`);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [CLIENT_HOST, LUMI_HOST],
    methods: ["GET", "POST"]
  }
});


app.use(cors())
app.set('trust proxy', true);

new Application(io);

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
