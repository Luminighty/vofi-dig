import { Text } from "pixi.js";
import { Serializable } from "../../network";
import { World } from "../../entities";

@Serializable("name", "nameColor")
export class NameTagComponent {
	static readonly COMPONENT_ID = "NameTagComponent" as const;
	
	world!: World;
	offsetY = 0.75;
	_text!: Text
	get text() {
		if (this._text)
			return this._text;
		this._text = new Text("", {
			fontSize: 48,
			align: 'center',
			fontFamily: "monospace"
		});
		this._text.scale.set(.15);
		this._text.anchor.x = 0.5;
		this._text.anchor.y = this.offsetY;
		return this._text;
	}

	onInit(props) {
		this.world.renderContainers["UI"].addChild(this.text);
		this.name = props.name ?? this.name;
		this.nameColor = props.nameColor ?? this.nameColor;
	}

	get name() { return this.text.text }
	set name(value) { this.text.text = value; }
	
	get nameColor() { return this.text.style.fill }
	set nameColor(value) { this.text.style.fill = value; }

	onPositionChanged({x, y}) {
		this.text.position.set(x, y);
	}
}