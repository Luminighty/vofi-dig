import { Application } from "pixi.js";

enum ButtonState {
	released,
	idle,
	pressed,
	held,	
}

let appRefence!: Application;
export const Controls = {
	left: ButtonState.idle,
	right: ButtonState.idle,
	up: ButtonState.idle,
	down: ButtonState.idle,
	digging: ButtonState.idle,
	building: ButtonState.idle,
	jumping: ButtonState.idle,
	inventory: ButtonState.idle,
	mouse: {
		left: ButtonState.idle,
		middle: ButtonState.idle,
		right: ButtonState.idle,
		screenX: 0, screenY: 0,
		get x() {
			return (this.screenX - appRefence.stage.position.x) / appRefence.stage.scale.x + appRefence.stage.pivot.x
		},
		get y() {
			return (this.screenY - appRefence.stage.position.y) / appRefence.stage.scale.y + appRefence.stage.pivot.y
		},
		scrollY: 0,
	},

	get x() {
		return +Controls.isHeld(this.right) - +Controls.isHeld(this.left)
	},
	get y() {
		return +Controls.isHeld(this.down) - +Controls.isHeld(this.up)
	},
	app: null,

	/** True during the first frame the button was pressed */
	isPressed(button: ButtonState) { return button === ButtonState.pressed; },
	/** True while the button is pressed */
	isHeld(button: ButtonState) { return button === ButtonState.pressed || button === ButtonState.held; },
	/** True during the first frame the button was released */
	isReleased(button: ButtonState) { return button === ButtonState.released;},
	/** True while the button is not pressed */
	isIdle(button: ButtonState) { return button === ButtonState.released || button === ButtonState.idle; },
}

const KeyBinds = {
	"KeyW": "up",
	"KeyA": "left",
	"KeyS": "down",
	"KeyD": "right",
	"KeyC": "digging",
	"Space": "jumping",
	"KeyV": "building",
	"KeyE": "inventory",
}

const MouseButtons = [ "left", "middle", "right" ];

export function initControls(app: Application) {
	appRefence = app;

	window.addEventListener('keydown', (event) => {
		const key = KeyBinds[event.code];
		if (key && !event.repeat)
			event.preventDefault();
			Controls[key] = ButtonState.pressed;
	});

	
	window.addEventListener('keyup', (event) => {
		const key = KeyBinds[event.code];
		if (key)
			Controls[key] = ButtonState.released;
	});

	window.document.removeEventListener('mousemove', app.renderer.plugins.interaction.onPointerMove, true);
	window.document.removeEventListener('pointermove', app.renderer.plugins.interaction.onPointerMove, true);
	app.stage.eventMode = "static"
	window.addEventListener("pointermove", (event) => {
		Controls.mouse.screenX = event.x;
		Controls.mouse.screenY = event.y;
	})
	
	window.addEventListener("pointerdown", (event) => {
		Controls.mouse[MouseButtons[event.button]] = ButtonState.pressed;
	});
	window.addEventListener("pointerup", (event) => {
		Controls.mouse[MouseButtons[event.button]] = ButtonState.released;
	});

	window.addEventListener("wheel", (event) => {
		Controls.mouse.scrollY = Math.sign(event.deltaY);
	});
}

function stepButtonState(object, key) {
	const button = object[key] as ButtonState;
	switch (button) {
		case ButtonState.pressed:
			object[key] = ButtonState.held;
			break;
		case ButtonState.released:
			object[key] = ButtonState.idle;
			break;
		default:
			break;
	}
}

export function updateControls() {
	Controls.mouse.scrollY = 0;
	stepButtonState(Controls, "left");
	stepButtonState(Controls, "right");
	stepButtonState(Controls, "up");
	stepButtonState(Controls, "down");
	stepButtonState(Controls, "digging");
	stepButtonState(Controls, "building");
	stepButtonState(Controls, "jumping");
	stepButtonState(Controls, "inventory");
	stepButtonState(Controls.mouse, "left");
	stepButtonState(Controls.mouse, "middle");
	stepButtonState(Controls.mouse, "right");
}