import { Entity } from "../../entities";
import { SpriteSocketComponent } from "../SpriteSocket.component";

export class PlayerSkinComponent {
	static readonly COMPONENT_ID = "PlayerSkinComponent" as const;
	parent!: Entity
	sprite!: SpriteSocketComponent;

	hat = generateSources("hat", 5);
	beard = generateSources("beard", 5);
	body = generateSources("body", 5);
	clothes = generateSources("clothes", 5);

	onInit() {
		this.sprite = this.parent.getComponent(SpriteSocketComponent);

		window.addEventListener("keydown", (event) => {
			if (event.code === "KeyP")
				this.randomize();
		});
	}

	randomize() {
		const hat = this.hat[Math.floor(Math.random() * this.hat.length)];
		const beard = this.beard[Math.floor(Math.random() * this.beard.length)];
		const body = this.body[Math.floor(Math.random() * this.body.length)];
		const clothes = this.clothes[Math.floor(Math.random() * this.clothes.length)];

		this.sprite.onSetSpriteSocket("hat", {src: hat});
		this.sprite.onSetSpriteSocket("beard", {src: beard});
		this.sprite.onSetSpriteSocket("body", {src: body});
		this.sprite.onSetSpriteSocket("clothes", {src: clothes});
	}

}

const generateSources = (key: string, amount: number) =>
	Array(amount).fill(0).map((_, i) => `assets/textures/miner/${key}/${`${i}`.padStart(4, "0")}.png`);