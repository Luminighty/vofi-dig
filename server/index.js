const path = require('path');
const express = require("express");
const { Server } = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public_html')));
app.use(express.static(path.join(__dirname, '../assets')));

server.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});
