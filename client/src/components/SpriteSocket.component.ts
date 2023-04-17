import { Container, Sprite, Texture } from "pixi.js";
import { World } from "../entities";

interface ISpriteSocket {
	src: string,
	offsetX: number,
	offsetY: number,
	anchorX: number,
	anchorY: number,
}

export class SpriteSocketComponent {
	static readonly COMPONENT_ID = "SpriteSocketComponent" as const;
	keys: string[] = [];
	sockets: {[key: string]: ISpriteSocket} = {};
	sprites: {[key: string]: Sprite} = {};
	container!: Container;
	world!: World;
	layer = "default";

	onInit({ x, y }) {
		this.container = new Container();
		this.container.position.set(x, y);
		this.keys.forEach((key) => {
			const data = this.sockets[key];
			const sprite = new Sprite();
			if (data.src)
				sprite.texture = Texture.from(data.src);
			this.container.addChild(sprite);
			sprite.anchor.set(data.anchorX ?? 0, data.anchorY ?? 0);
			sprite.position.set(data.offsetX ?? 0, data.offsetY ?? 0);
			this.sprites[key] = sprite;
			return sprite;
		});
		this.world.renderContainers[this.layer].addChild(this.container);
	}

	onSetSpriteSocket(key: string, socket?: Partial<ISpriteSocket>) {
		const sprite = this.sprites[key];
		sprite.visible = socket?.src !== "null";
		if (socket) {
			if (socket.src)
				sprite.texture = Texture.from(socket.src);
			if (socket.anchorX)
				sprite.anchor.x = socket.anchorX;
			if (socket.anchorY)
				sprite.anchor.y = socket.anchorY;
			if (socket.offsetX)
				sprite.position.x = socket.offsetX;
			if (socket.offsetY)
				sprite.position.y = socket.offsetY;
			this.sockets[key] = { ...this.sockets[key], ...socket };
			sprite.updateTransform();
		}
	}

	onMove({x}) {
		if (x * this.container.scale.x < 0)
			this.container.scale.x *= -1;
	}

	onPositionChanged({ x, y }) {
		this.container.x = x;
		this.container.y = y;
	}

	onLoad() {
		this.container.visible = true;
	}

	onUnload() {
		this.container.visible = false;
	}

	static serialize(self: SpriteSocketComponent) {
		const sockets = {};
		for (const key of self.keys) {
			const socket = self.sockets[key];
			sockets[`socket.${key}.src`] = socket.src;
			sockets[`socket.${key}.offsetX`] = socket.offsetX;
			sockets[`socket.${key}.offsetY`] = socket.offsetY;
			sockets[`socket.${key}.anchorX`] = socket.anchorX;
			sockets[`socket.${key}.anchorY`] = socket.anchorY;
		}
		return {
			...sockets,
			"scale.x": self.container.scale.x,
			"scale.y": self.container.scale.y,
			"visible": self.container.visible,
		}
	}

	static deserialize(self: SpriteSocketComponent, data) {
		self.keys = data.keys ?? self.keys;
		for (const key of data.keys ?? self.keys) {
			const src = data[`socket.${key}.src`];
			const offsetX = data[`socket.${key}.offsetX`];
			const offsetY = data[`socket.${key}.offsetY`];
			const anchorX = data[`socket.${key}.anchorX`];
			const anchorY = data[`socket.${key}.anchorY`];
			self.onSetSpriteSocket(key, { src, offsetX, offsetY, anchorX, anchorY });
		}
		self.container.scale.x = data["scale.x"] ?? self.container.scale.x;
		self.container.scale.y = data["scale.y"] ?? self.container.scale.y;
		self.container.visible = data["visible"] ?? self.container.visible;
	}
}

