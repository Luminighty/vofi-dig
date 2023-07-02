import { Socket } from "socket.io-client";
import { Entity, World } from "../entities";
import { ServerActorComponent } from "../components/network/ServerActor.component";
import { ILoadingBar } from "../dialogs/LoadingBar";
import { IVector2 } from "@dig/math";
import { PositionToChunk } from "../config";


export class NetworkHandler {
	private loadingBar: ILoadingBar | null = null;

	constructor(
		private world: World,
		private socket: Socket,
	) {
		this.socket = socket;
		socket.on("entity update", this.onEntityUpdate.bind(this));
		socket.on("entity create", this.onEntityCreate.bind(this));
		socket.on("entity createAll", this.onEntityCreateAll.bind(this));
		socket.on("entity destroy", this.onEntityDestroy.bind(this));
		socket.on("entity destroy", this.onEntityDestroy.bind(this));
		socket.on("sync entity action", this.onSyncEntityAction.bind(this));

	}

	public updateEntity(id, body) {
		this.socket.emit("entity update", id, body);
	}

	public async getState(loadingBar: ILoadingBar, spawn: IVector2) {
		this.loadingBar = loadingBar;
		this.loadingBar.determinate = false;
		this.loadingBar.label = "Getting game state";
		const chunk = PositionToChunk(spawn);
		const entities = await new Promise((res) => this.socket.emit("query entities", chunk, (entities: NetworkEntity[]) => res(entities)));
		await Promise.all(
			(entities as NetworkEntity[]).map(async (entity) => {
				await this.world.addEntity(entity.blueprintId, entity.props, entity.id);
			})
		);
		if (this.loadingBar)
			this.loadingBar.determinate = true;
		this.loadingBar = null;
	}

	public getChunk(chunkX: number, chunkY: number) {
		this.socket.emit("query chunk", chunkX, chunkY, (entities) => {
			entities.forEach((entity) => {
				requestIdleCallback(() => {
					this.world.addEntity(entity.blueprintId, entity.props, entity.id);
				})
			})
		});
	}

	public initPlayer(): Promise<{userId: string, entities: number[], spawn: IVector2}> {
		return new Promise((res) => {
			this.socket.emit("game init", res);
		})
	}

	public syncAction(id, event, props) {
		this.socket.emit("sync entity action", id, event, props);	
	}

	private onSyncEntityAction(id, event, props) {
		for (const entity of this.world.entities.values()) {
			if (entity.id !== id)
				continue;
				entity.fireEvent(event, props);
			return;
		}
		console.log(`Entity ${id} not found! (${event}, ${props})`);
	}
	
	private onEntityUpdate(id, props) {
		const actors = this.world.queryEntity(ServerActorComponent)[0];
		const actor = actors.find((actor) => actor.parent.id === id);
		if (!actor) {
			console.log(`Actor '${id}' not found! Is this a client entity?`);
			return;
		}
		actor.updateEntity(props);
	}

	private onEntityCreate(id, type, props) {
		this.world.addEntity(type, props, id);
	}

	private onEntityCreateAll(entities: NetworkEntity[]) {
		let progress = 0;
		for (const entity of entities) {
			this.loadingBar?.update("Loading entity", ++progress, entities.length);
			this.world.addEntity(entity.blueprintId, entity.props, entity.id);
		}
	}
	
	private onEntityDestroy(id) {
		for (const entity of this.world.entities.values()) {
			if (entity.id !== id)
				continue;
			this.world.removeEntity(entity);
			return;
		}
	}

	async createEntity(type, props, ack) {
		this.socket.emit("entity create", type, props, ack)
	}

	destroyEntity(entity: Entity) {
		this.socket.emit("entity destroy", entity.id)
	}

}

interface NetworkEntity {
	id: number,
	blueprintId: string,
	props: object,
}