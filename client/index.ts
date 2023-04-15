import { Application, Assets } from "pixi.js";
import { assetsManifest } from "./assets";
import { AppConfig } from "./config";
import { Init } from "./Game";
import io from 'socket.io-client';

const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "scene";
canvas.width = AppConfig.width;
canvas.height = AppConfig.height;

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

// window.addEventListener("beforeunload", (e) => {
// 	e.preventDefault();
// 	e.returnValue = "Are you sure you want to quit the game?";
// });
const socket = io('http://localhost:3000');
(async () =>{
	Resize();
	await Assets.init({ manifest: assetsManifest })
	await Assets.loadBundle("ALL");
	Init(app, socket);

	setInterval(() => {
		fpsElement!.innerHTML = `FPS: ${app.ticker.FPS.toFixed(2)}`;
	}, 100);
})();

