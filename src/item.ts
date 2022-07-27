import { Color, serializable } from 'wglt';
import { Action, ItemAction } from './actions';
import { Actor } from './actor';
import { BaseAI, ConfusedEnemy } from './ai';
import { HEALTH_RECOVERED_COLOR, NEEDS_TARGET_COLOR, RED, STATUS_EFFECT_APPLIED_COLOR } from './color';
import { Engine } from './engine';
import { Entity, RenderOrder } from './entity';
import { AreaRangedAttackHandler, SingleRangedAttackHandler } from './handlers';
import { removeFromArray } from './utils';

export abstract class Item extends Entity {
  constructor(char: string, color: Color, name: string) {
    super(0, 0, char, color, name, false, RenderOrder.ITEM);
  }

  getAction(_engine: Engine, consumer: Actor): Action | undefined {
    return new ItemAction(consumer, this);
  }

  abstract activate(engine: Engine, action: Action): void;
}

@serializable
export class HealingItem extends Item {
  constructor(char: string, color: Color, name: string, readonly amount: number) {
    super(char, color, name);
  }

  activate(engine: Engine, action: Action): void {
    const amountRecovered = action.actor.heal(engine, this.amount);
    if (amountRecovered > 0) {
      consume(action.actor, this);
      engine.log(`You consume the ${this.name}, and recover ${amountRecovered} HP!`, HEALTH_RECOVERED_COLOR);
    } else {
      throw new Error('Your health is already full.');
    }
  }
}

@serializable
export class LightningDamageItem extends Item {
  constructor(char: string, color: Color, name: string, readonly damage: number, readonly maxRange: number) {
    super(char, color, name);
  }

  activate(engine: Engine, action: Action): void {
    const consumer = action.actor;
    let target = undefined;
    let closestDistance = this.maxRange + 1;

    for (const actor of engine.gameMap.actors) {
      if (actor !== consumer && engine.gameMap.isVisible(actor.x, actor.y)) {
        const distance = consumer.distance(actor.x, actor.y);
        if (distance < closestDistance) {
          target = actor;
          closestDistance = distance;
        }
      }
    }

    if (target) {
      engine.log(`A lightning bolt strikes the ${target.name} with a loud thunder, for ${this.damage} damage!`);
      target.takeDamage(engine, this.damage);
      consume(action.actor, this);
    } else {
      throw new Error('No enemy is close enough to strike.');
    }
  }
}

@serializable
export class ConfusionItem extends Item {
  constructor(char: string, color: Color, name: string, readonly numberOfTurns: number) {
    super(char, color, name);
  }

  getAction(engine: Engine, consumer: Actor): Action | undefined {
    engine.log('Select a target location', NEEDS_TARGET_COLOR);
    engine.eventHandler = new SingleRangedAttackHandler(engine, new ItemAction(consumer, this));
    return undefined;
  }

  activate(engine: Engine, action: Action): void {
    const x = action.target?.x as number;
    const y = action.target?.y as number;
    if (!engine.gameMap.isVisible(x, y)) {
      throw new Error('You cannot target an area that you cannot see.');
    }

    const target = engine.gameMap.getActor(x, y);
    if (!target) {
      throw new Error('You must select an enemy to target.');
    }

    const consumer = action.actor;
    if (target === consumer) {
      throw new Error('You cannot confuse yourself!');
    }

    engine.log(
      `The eyes of the ${target.name} look vacant, as he starts to stumble around!`,
      STATUS_EFFECT_APPLIED_COLOR
    );
    target.ai = new ConfusedEnemy(target.ai as BaseAI, this.numberOfTurns);
    consume(consumer, this);
  }
}

@serializable
export class FireballDamageItem extends Item {
  constructor(char: string, color: Color, name: string, readonly damage: number, readonly radius: number) {
    super(char, color, name);
  }

  getAction(engine: Engine, consumer: Actor): Action | undefined {
    engine.log('Select a target location', NEEDS_TARGET_COLOR);
    engine.eventHandler = new AreaRangedAttackHandler(engine, this.radius, new ItemAction(consumer, this));
    return undefined;
  }

  activate(engine: Engine, action: Action): void {
    const x = action.target?.x as number;
    const y = action.target?.y as number;
    if (!engine.gameMap.isVisible(x, y)) {
      throw new Error('You cannot target an area that you cannot see.');
    }

    let hit = false;
    for (const actor of engine.gameMap.actors) {
      if (actor.distance(x, y) <= this.radius) {
        engine.log(`The ${actor.name} is engulfed in a fiery explosion, taking ${this.damage} damage!`, RED);
        actor.takeDamage(engine, this.damage);
        hit = true;
      }
    }

    if (!hit) {
      throw new Error('There are no targets in the radius.');
    }

    consume(action.actor, this);
  }
}

function consume(actor: Actor, item: Item): void {
  removeFromArray(actor.inventory, item);
}
