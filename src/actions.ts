import { Engine } from './engine';
import { Entity } from './entity';

export abstract class Action {
  abstract perform(engine: Engine, entity: Entity): void;
}

export abstract class ActionWithDirection extends Action {
  constructor(public dx: number, public dy: number) {
    super();
  }
}

export class MeleeAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity): void {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;
    const target = engine.gameMap.getBlockingEntity(destX, destY);
    if (!target) {
      return;
    }
    console.log(`You kick the ${target.name}, much to its annoyance!`);
  }
}

export class MovementAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity): void {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;

    if (engine.gameMap.isWall(destX, destY)) {
      // Destination is out of bounds or blocked by a tile
      return;
    }
    if (engine.gameMap.getBlockingEntity(destX, destY)) {
      // Destination is blocked by an entity
      return;
    }

    entity.move(this.dx, this.dy);
  }
}

export class BumpAction extends ActionWithDirection {
  perform(engine: Engine, entity: Entity): void {
    const destX = entity.x + this.dx;
    const destY = entity.y + this.dy;
    const target = engine.gameMap.getBlockingEntity(destX, destY);
    if (target) {
      return new MeleeAction(this.dx, this.dy).perform(engine, entity);
    } else {
      return new MovementAction(this.dx, this.dy).perform(engine, entity);
    }
  }
}
