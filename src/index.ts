import { Application, Assets } from "pixi.js";
import { assetsManifest } from "./assets";
import { AppConfig } from "./config";
import { Init } from "./Game";

const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "scene";
canvas.width = AppConfig.width;
canvas.height = AppConfig.height;

window.addEventListener("resize", Resize);

const app = new Application({
	...AppConfig,
	view: canvas,
});


function Resize() {
	const scaleY = Math.floor(window.innerHeight / AppConfig.height);
	const scaleX = Math.floor(window.innerWidth / AppConfig.width);
	const scale = Math.min(scaleY, scaleX);
	app.renderer.resize(AppConfig.width * scale, AppConfig.height * scale);
	app.stage.scale.set(scale);
}

(async () =>{
	Resize();
	await Assets.init({ manifest: assetsManifest })
	await Assets.loadBundle("ALL");
	Init(app);
})();
