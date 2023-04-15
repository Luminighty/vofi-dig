import { Server, Socket } from "socket.io";
import { Game } from "./Game";
import { Client } from "./Client";

export class Application {
	private server: Server;
	private clients: Client[] = [];
	public game: Game;

	constructor(server: Server) {
		this.game = new Game();
		this.server = server;
		this.server.on("connection", (socket) => {
			console.log('a user connected');
			this.clients.push(new Client(this, this.game, socket));
		});
	}



}