import { IVector2, Vector2 } from "@dig/math";
import { Entity, World } from "../entities";
import { IEntityFilter } from "../entities/filter";
import { baseEvent } from "../events";
import { PositionComponent } from "./Position.component";

const CollisionMatrix = postProcessLayers({
	"item": ["tile"],
	"player": ["entity", "player"],
	"entity": ["tile"],
});
const MAXIMUM_ITERATIONS = 16;

export class CollisionComponent {
	static readonly COMPONENT_ID = "CollisionComponent" as const;
	world!: World;
	parent!: Entity;
	position!: PositionComponent;
	shape: Polygon = [];
	boundingBox = 0;
	isStuck = false;
	enabled = true;
	shouldUnload = false;
	layer = "entity";

	onInit() {
		this.position = this.parent.getComponent(PositionComponent);

		this.boundingBox = Math.max(...this.shape.map((v) => Math.abs(v.x) + Math.abs(v.y)));
	}

	worldShape({x, y}: IVector2) {
		return this.shape.map((v) => Vector2.add(v, {
			x: this.position.x + x,
			y: this.position.y + y,
		}));
	}

	onMove(delta) {
		this.checkCollision(delta);
	}


	onUpdate() {
		if (this.isStuck)
			this.checkCollision({x: 0, y: 0});
	}

	checkCollision(delta) {
		if (!this.enabled)
			return;
		const [colliders] = this.world
			.withFilter(CollisionFilter(this))
			.queryEntity(CollisionComponent);

		let iterations = 0;
		while(this.collisionStep(delta, colliders) !== 0 && iterations < MAXIMUM_ITERATIONS)
			iterations++;

		if (iterations >= MAXIMUM_ITERATIONS) {
			if (!this.isStuck)
				this.parent.fireEvent(baseEvent("onStuck"));
			this.isStuck = true;
		} else if (this.isStuck) {
			this.parent.fireEvent(baseEvent("onUnStuck"));
			this.isStuck = false;
		}
	}

	collisionStep(delta: IVector2, colliders: CollisionComponent[]) {
		const currentColliders: Array<CollisionComponent> = [];
		let mostSignificant: IVector2 | null = null;
		let mostSignificantLength = 0;
		for (const other of colliders) {
			const pushVector = SAT(this.worldShape(delta), other.worldShape({x: 0, y: 0}));
			if (pushVector) {
				currentColliders.push(other);
				const length = Vector2.dot(pushVector, pushVector);
				if (mostSignificantLength < length) {
					mostSignificant = pushVector;
					mostSignificantLength = length;
				}
			}
		}
		if (mostSignificant) {
			this.position.x -= mostSignificant.x;
			this.position.y -= mostSignificant.y;
			this.parent.fireEvent(baseEvent("onCollide", mostSignificant));
		}
		return currentColliders.length
	}
}


function CollisionFilter(self: CollisionComponent): IEntityFilter {
	const id = CollisionComponent.COMPONENT_ID;
	return (types, groups) => {
		const index = types.findIndex((type) => type["COMPONENT_ID"] === id);
		if (index < 0)
			return;
		groups[index] = (groups[index] as CollisionComponent[])
		.filter((other) => 
			other !== self && other.enabled && CollisionMatrix[self.layer][other.layer] &&
			Math.abs(other.position.x - self.position.x) + Math.abs(other.position.y - self.position.y) < self.boundingBox + other.boundingBox
		);
	}
}


function postProcessLayers(matrix: {[key: string]: string[]}): {[key: string]: {[key: string]: boolean}} {
	const m = {};
	for (const key in matrix) {
		const element = matrix[key];
		m[key] = {};
		for (const other of element) {
			if (!m[other])
				m[other] = {};
			m[key][other] = true;
			m[other][key] = true;
		}
	}
	return m;
}


type Polygon = IVector2[];
type Edge = IVector2;

/**
 * Separating Axis Theorem
 */
function SAT(left: Polygon, right: Polygon) {
	const orthogonals = [...toEdges(left), ...toEdges(right)].map(Vector2.orthogonal);
	const pushVectors: IVector2[] = [];

	for (const orthogonal of orthogonals) {
		const pv = isSeparatingAxis(orthogonal, left, right);
		if (!pv)
			return null;
		pushVectors.push(pv);
	}

	let minValue = Vector2.dot(pushVectors[0], pushVectors[0]);
	let minIndex = 0;
	for (let i = 1; i < pushVectors.length; i++) {
		const value = Vector2.dot(pushVectors[i], pushVectors[i]);
		if (value < minValue) {
			minIndex = i;
			minValue = value;
		}
	}

	const minPushVector = pushVectors[minIndex];
	const displacement = centerDisplacement(left, right);

	if ( Vector2.dot(displacement, minPushVector) > 0)
		return Vector2.neg(minPushVector);
	return minPushVector;
}

function centerDisplacement(left: Polygon, right: Polygon) {
	const c1 = {
		x: left.reduce((acc, curr) => acc + curr.x, 0) / left.length,
		y: left.reduce((acc, curr) => acc + curr.y, 0) / left.length,
	}	
	const c2 = {
		x: right.reduce((acc, curr) => acc + curr.x, 0) / left.length,
		y: right.reduce((acc, curr) => acc + curr.y, 0) / left.length,
	}
	return Vector2.sub(c1, c2);
}

function toEdges(polygon: Polygon) {
	const edges: Edge[] = [];
	const length = polygon.length;
	for (let i = 0; i < length; i++) {
		edges[i] = Vector2.sub(polygon[(i + 1) % length], polygon[i]);
	}
	return edges;
}

function isSeparatingAxis(orthogonal: IVector2, left: Polygon, right: Polygon) {
	let min1 = Number.MAX_SAFE_INTEGER;
	let min2 = Number.MAX_SAFE_INTEGER;
	let max1 = Number.MIN_SAFE_INTEGER;
	let max2 = Number.MIN_SAFE_INTEGER;

	for (const vector of left) {
		const product = Vector2.dot(vector, orthogonal);
		min1 = Math.min(min1, product);
		max1 = Math.max(max1, product);
	}

	for (const vector of right) {
		const product = Vector2.dot(vector, orthogonal);
		min2 = Math.min(min2, product);
		max2 = Math.max(max2, product);
	}

	if (max1 >= min2 && max2 >= min1) {
		const distance = Math.min(max2 - min1, max1 - min2)
		const DoVSqr = distance / Vector2.dot(orthogonal, orthogonal) + 1e-10
		const pv = Vector2.scalar(DoVSqr, orthogonal);
		return pv;
	}
	return null;
}
