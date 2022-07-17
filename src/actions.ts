import { capitalize, serializable } from 'wglt';
import { Actor } from './actor';
import { Engine } from './engine';

export abstract class Action {
  constructor(public actor: Actor) {}

  abstract perform(engine: Engine): void;
}

export abstract class ActionWithDirection extends Action {
  constructor(actor: Actor, public dx: number, public dy: number) {
    super(actor);
  }
}

@serializable
export class MeleeAction extends ActionWithDirection {
  perform(engine: Engine): void {
    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;
    const target = engine.gameMap.getActor(destX, destY);
    if (!target) {
      return;
    }

    const damage = this.actor.power - target.defense;
    const attackDesc = capitalize(this.actor.name) + ' attacks ' + target.name;
    if (damage > 0) {
      console.log(attackDesc + ' for ' + damage + ' hit points!');
      target.hp -= damage;
    } else {
      console.log(attackDesc + ' but does no damage.');
    }
  }
}

@serializable
export class MovementAction extends ActionWithDirection {
  perform(engine: Engine): void {
    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;

    if (engine.gameMap.isWall(destX, destY)) {
      // Destination is out of bounds or blocked by a tile
      return;
    }
    if (engine.gameMap.getBlockingEntity(destX, destY)) {
      // Destination is blocked by an actor
      return;
    }

    this.actor.move(this.dx, this.dy);
  }
}

@serializable
export class BumpAction extends ActionWithDirection {
  perform(engine: Engine): void {
    if (this.dx === 0 && this.dy === 0) {
      // Wait action
      return;
    }

    const destX = this.actor.x + this.dx;
    const destY = this.actor.y + this.dy;
    const target = engine.gameMap.getActor(destX, destY);
    if (target) {
      return new MeleeAction(this.actor, this.dx, this.dy).perform(engine);
    } else {
      return new MovementAction(this.actor, this.dx, this.dy).perform(engine);
    }
  }
}
