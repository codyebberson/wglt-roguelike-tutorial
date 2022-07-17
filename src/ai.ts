import { PointLike, serializable } from 'wglt';
import { MeleeAction, MovementAction } from './actions';
import { Actor } from './actor';
import { Engine } from './engine';

export abstract class BaseAI {
  abstract perform(engine: Engine, actor: Actor): void;

  walkToward(engine: Engine, actor: Actor, dest: PointLike): void {
    const path = engine.gameMap.computePath(actor, dest);
    if (path) {
      const next = path[1];
      const nextDx = next.x - actor.x;
      const nextDy = next.y - actor.y;
      new MovementAction(actor, nextDx, nextDy).perform(engine);
    }
  }
}

@serializable
export class HostileEnemy extends BaseAI {
  perform(engine: Engine, actor: Actor): void {
    const target = engine.player;
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));

    if (!engine.gameMap.isVisible(actor.x, actor.y)) {
      // Do nothing if the actor is not visible.
      return;
    }

    if (distance <= 1) {
      // Attack the player if they are adjacent.
      new MeleeAction(actor, dx, dy).perform(engine);
      return;
    }

    // Move towards the player.
    this.walkToward(engine, actor, target);
  }
}