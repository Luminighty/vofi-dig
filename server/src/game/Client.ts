import { Socket } from "socket.io";
import { Application } from "./Application";
import { Entity, Game } from "./Game";
import { v4 as uuidv4 } from 'uuid';

export class Client {
	private _userId: string;
	private set userId(value) { this._userId = value; }
	public get userId() { return this._userId }
	entities: number[] = [];

	get socket() { return this._socket; }
	set socket(value) {
		this.removeEventListeners();
		this._socket = value;
		this.addEventListeners();
	}

	constructor(
		private app: Application,
		private game: Game,
		private _socket: Socket
	) {
		this._userId = uuidv4();
		this.app = app;
		this.game = game;
		this.socket = _socket;
	}

	removeEventListeners() {
		if (!this.socket)
			return;
		this.socket.removeAllListeners();
	}

	addEventListeners() {
		this.socket.on("game init", this.onGameInit.bind(this));
		this.socket.on("query entities", this.onQueryEntities.bind(this));
		this.socket.on("query chunk", this.onQueryChunk.bind(this));
		this.socket.on("entity update", this.onEntityUpdate.bind(this));
		this.socket.on("entity create", this.onEntityCreate.bind(this));
		this.socket.on("entity destroy", this.onEntityDestroy.bind(this));
		this.socket.on("sync entity action", this.onSyncEntityAction.bind(this));
	}

	onSyncEntityAction(id, event, props) {
		this.socket.broadcast.emit("sync entity action", id, event, props);
	}

	onQueryEntities(chunk, res) {
		const entities: Entity[] = [];
		const maxDistance = 2;
		this.app.game.forEachEntities((value) => {
			if (value.owner === this.userId)
				return;
			const delta = value.chunk
				? Math.abs(value.chunk.x - chunk.x) + Math.abs(value.chunk.y - chunk.y)
				: 0;
			if (delta > maxDistance)
				return;
			entities.push(value);
		});
		res(entities);
	}

	onQueryChunk(chunkX, chunkY, res) {
		const entities = this.game.getEntitiesOnChunk(chunkX, chunkY);
		res?.(entities);
	}

	onEntityDestroy(id) {
		this.game.deleteById(id);
		this.socket.broadcast.emit("entity destroy", id);
	}


	onEntityUpdate(id, body) {
		this.game.updateEntity(id, body);
		this.socket.broadcast.emit("entity update", id, body);
	}

	onEntityCreate(type, props, res) {
		let owner;
		if (props?.isClientOwned) {
			owner = this.userId;
		}
		delete props.isClientOwned;
		const entity = this.game.createEntity(type, props, owner);
		if (owner)
			this.entities.push(entity.id);
		res(entity.id);
		this.socket.broadcast.emit("entity create", entity.id, entity.blueprintId, entity.props);
	}

	onGameInit(ack) {
		const entities = this.entities.filter((id) => 
			this.game.getById(id)?.owner === this.userId
		);
		this.entities = entities;
		console.log({entities});
		
		ack({
			userId: this.userId,
			entities,
			spawn: this.game.spawn
		});
	}

}
