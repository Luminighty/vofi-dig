import { registerComponent } from ".";
import { VelocityComponent } from "./Velocity.component";
import { PlayerComponent } from "./Player.component";
import { PositionComponent } from "./Position.component";
import { SpriteComponent } from "./Sprite.component";
import { CollisionComponent } from "./Collision.component";
import { DebugRectComponent } from "./DebugRect.component";

export function registerComponents() {
	registerComponent(SpriteComponent);
	registerComponent(PositionComponent);
	registerComponent(PlayerComponent);
	registerComponent(VelocityComponent);
	registerComponent(CollisionComponent);
	registerComponent(DebugRectComponent);
}
