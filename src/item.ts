import { Color, serializable } from 'wglt';
import { Action, ItemAction } from './actions';
import { Actor } from './actor';
import { HEALTH_RECOVERED_COLOR } from './color';
import { Engine } from './engine';
import { Entity, RenderOrder } from './entity';
import { removeFromArray } from './utils';

export abstract class Item extends Entity {
  constructor(char: string, color: Color, name: string) {
    super(0, 0, char, color, name, false, RenderOrder.ITEM);
  }

  getAction(consumer: Actor): Action | undefined {
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
      removeFromArray(action.actor.inventory, this);
      engine.log(`You consume the ${this.name}, and recover ${amountRecovered} HP!`, HEALTH_RECOVERED_COLOR);
    } else {
      throw new Error('Your health is already full.');
    }
  }
}
