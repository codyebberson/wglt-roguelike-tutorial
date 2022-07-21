import { capitalize, serializable } from 'wglt';
import { Actor } from './actor';
import { ENEMY_ATTACK_COLOR, PLAYER_ATTACK_COLOR } from './color';
import { Engine } from './engine';
import { Item } from './item';
import { removeFromArray } from './utils';

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
    const color = this.actor === engine.player ? PLAYER_ATTACK_COLOR : ENEMY_ATTACK_COLOR;

    if (damage > 0) {
      engine.log(attackDesc + ' for ' + damage + ' hit points!', color);
      target.takeDamage(engine, damage);
    } else {
      console.log(attackDesc + ' but does no damage.', color);
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
      throw new Error('That way is blocked.');
    }
    if (engine.gameMap.getBlockingEntity(destX, destY)) {
      // Destination is blocked by an actor
      throw new Error('That way is blocked.');
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

@serializable
export class PickupAction extends Action {
  perform(engine: Engine): void {
    const item = engine.gameMap.getItem(this.actor.x, this.actor.y);
    if (!item) {
      throw new Error('There is nothing here to pick up.');
    }

    this.actor.inventory.push(item);
    removeFromArray(engine.gameMap.entities, item);
    engine.log(`You picked up the ${item.name}!`);
  }
}

@serializable
export class ItemAction extends Action {
  constructor(actor: Actor, readonly item: Item) {
    super(actor);
  }

  perform(engine: Engine): void {
    this.item.activate(engine, this);
  }
}
