import { CollisionComponent } from "../components/Collision.component"
import { TriggerColliderComponent } from "../components/TriggerCollider.component"


export const OnTriggerEnterEvent = "onTriggerEnter"
export const OnTriggerExitEvent = "onTriggerEnter"

export type TriggerEventProps = { source: TriggerColliderComponent | CollisionComponent }
export type Vector2EventProps = { x: number, y: number }
/** A vector that will attempt to move them out of the collision */
export type OnCollideEventProps = { x: number, y: number }
export type OnMoveProps = Vector2EventProps;