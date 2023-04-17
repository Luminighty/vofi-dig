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
		this.server.on("connection", this.onConnection.bind(this));
	}

	onConnection(socket: Socket) {
		const query = socket.handshake.query;
		let client = query?.userId !== null && this.clients.find((client) => client.userId === query.userId)
		if (!client) {
			client = this.onNewUserConnected(socket); 
		} else {
			console.log(`A user has reconnected: ${client.userId}`);
			client.socket = socket;
		}
	}

	private onNewUserConnected(socket: Socket) {
		const client = new Client(this, this.game, socket);
		console.log(`A new user has connected: ${client.userId}`);
		this.clients.push(client);
		return client;
	}

}