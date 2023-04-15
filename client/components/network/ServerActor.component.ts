import { World, Entity } from "../../entities";
import { Vector2 } from "../../math";

export class ServerActorComponent {
	static readonly COMPONENT_ID = "ServerActorComponent" as const;
	world!: World;
	parent!: Entity;
	components = {};
	targetState = {};

	onLateInit(props) {
		// for (const componentType in props) {
		// 	const componentProps = props[componentType];
		// 	if (!this.components[componentType])
		// 		this.components[componentType] = this.parent.getComponentByTypeId(componentType);
		// 	ImmediateSyncComponent[componentType](this.components[componentType], componentProps);
		// }
	}

	updateEntity(props) {
		for (const componentType in props) {
			const componentProps = props[componentType];
			if (!this.components[componentType])
				this.components[componentType] = this.parent.getComponentByTypeId(componentType);
			this.targetState[componentType] = componentProps;
		}
	}

	onUpdate({dt}) {
		for (const type in this.targetState) {
			const target = this.targetState[type];
			if (!target)
				continue;
			const component = this.components[type];
			const finished = SyncComponent[type](component, target, dt);
			if (finished)
				this.targetState[type] = null;
		}
	}
	
}

const MIN_STEP = 2;

const SyncComponent = {
	"PositionComponent": (component, props, dt) => {
		if (props.x == null || props.y == null)
			return;
		const delta = Vector2.sub(props, component.position);
		const length = Math.sqrt(Vector2.dot(delta, delta));
		if (length < MIN_STEP) {
			component.position = props;
			return true;
		}
		const unitDelta = Vector2.div(delta, length);
		component.onMove(Vector2.scalar(dt * length / 5, unitDelta))
		return false;
	},
	"SpriteComponent": (component, props) => {
		component.sprite.scale.x = props["scale.x"];
		return true;
	},
}