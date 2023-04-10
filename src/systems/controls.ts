export const Controls = {
	left: false,
	right: false,
	up: false,
	down: false,
	digging: false,
	jumping: false,
	get x() {
		return +this.right- +this.left
	},
	get y() {
		return +this.down - +this.up
	},
}

const KeyBinds = {
	"ArrowLeft": "left",
	"ArrowRight": "right",
	"ArrowUp": "up",
	"ArrowDown": "down",
	"KeyC": "digging",
	"KeyX": "jumping",
}

window.addEventListener('keydown', (event) => {
	const key = KeyBinds[event.code];
	if (key && !event.repeat)
		Controls[key] = true;
});

window.addEventListener('keyup', (event) => {
	const key = KeyBinds[event.code];
	if (key)
		Controls[key] = false;
});