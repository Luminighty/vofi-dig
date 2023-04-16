import { Socket } from "socket.io";
import { Application } from "./Application";
import { Entity, Game } from "./Game";

export class Client {
	constructor(
		private app: Application,
		private game: Game,
		public socket: Socket
	) {
		this.app = app;
		this.game = game;
		this.socket = socket;

		this.socket.on("query entities", this.onQueryEntities.bind(this));
		this.socket.on("entity update", this.onEntityUpdate.bind(this));
		this.socket.on("entity create", this.onEntityCreate.bind(this));
		this.socket.on("entity destroy", this.onEntityDestroy.bind(this));
		this.socket.on("sync entity action", this.onSyncEntityAction.bind(this));
	}

	onSyncEntityAction(id, event, props) {
		this.socket.broadcast.emit("sync entity action", id, event, props);
	}

	onQueryEntities(res) {
		const entities: Entity[] = [];
		this.app.game.entities.forEach((value) => entities.push(value));
		this.socket.emit("entity createAll", entities);
		res();
	}

	onEntityDestroy(id) {
		this.game.entities.delete(id);
		this.socket.broadcast.emit("entity destroy", id);
	}


	onEntityUpdate(id, body) {
		this.game.updateEntity(id, body);
		this.socket.broadcast.emit("entity update", id, body);
	}

	onEntityCreate(type, props, res) {
		const entity = this.game.createEntity(type, props);
		res(entity.id);
		this.socket.broadcast.emit("entity create", entity.id, entity.blueprintId, entity.props);
	}

}