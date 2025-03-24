import { Application } from "pixi.js";
import { AppConfig } from "./config";
import { Init } from "./Game";
import io from 'socket.io-client';
import { LocalStorage } from "./systems/storage";

const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "scene";

window.addEventListener("resize", Resize);

const app = new Application({
	...AppConfig,
	view: canvas,
});

app.stage.scale.set(AppConfig.scale);

const fpsElement = document.body.querySelector("#fps");

function Resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	app.screen.width = window.innerWidth;
	app.screen.height = window.innerHeight;
	app.stage.position.set(app.screen.width/2, app.screen.height/2);
}

document.addEventListener("contextmenu", event => event.preventDefault());

const socket = io(process.env.DIG_SERVER_HOST as string, {
	query: {
		userId: LocalStorage.getUserId()
	}
});

(async () =>{
	Resize();
	Init(app, socket);

	setInterval(() => {
		fpsElement!.innerHTML = `FPS: ${app.ticker.FPS.toFixed(2)}`;
	}, 100);
})();

