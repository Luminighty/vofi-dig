import { registerComponent } from ".";
import { VelocityComponent } from "./Velocity.component";
import { PlayerComponent } from "./player/Player.component";
import { PositionComponent } from "./Position.component";
import { SpriteComponent } from "./Sprite.component";
import { CollisionComponent } from "./Collision.component";
import { DebugRectComponent } from "./DebugRect.component";
import { DiggableComponent } from "./Diggable.component";
import { TileTagComponent } from "./TileTag.component";
import { CameraComponent } from "./Camera.component";
import { HealthComponent } from "./Health.component";
import { ChunkLoaderComponent } from "./player/ChunkLoader.component";
import { UpdateComponent } from "./Update.component";
import { ClientActorComponent } from "./network/ClientActor.component";
import { ServerActorComponent } from "./network/ServerActor.component";

export function registerComponents() {
	registerComponent(SpriteComponent);
	registerComponent(PositionComponent);
	registerComponent(PlayerComponent);
	registerComponent(VelocityComponent);
	registerComponent(CollisionComponent);
	registerComponent(DebugRectComponent);
	registerComponent(DiggableComponent);
	registerComponent(TileTagComponent);
	registerComponent(CameraComponent);
	registerComponent(HealthComponent);
	registerComponent(ChunkLoaderComponent);
	registerComponent(UpdateComponent);
	registerComponent(ClientActorComponent);
	registerComponent(ServerActorComponent);
}
