import { Application } from "./Application";

const path = require('path');
const express = require("express");
const { Server } = require("socket.io");
var cors = require('cors')
const http = require('http');


const PORT = process.env.PORT || 3000;
const clientPort = process.env.CLIENT_PORT || 8080;
const HOST = process.env.HOST || "localhost";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
	}
});


app.use(cors())
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, '../public_html')));
app.use(express.static(path.join(__dirname, '../assets')));

const gameApp = new Application(io);

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
