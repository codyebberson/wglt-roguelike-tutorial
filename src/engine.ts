import { serializable, Terminal } from 'wglt';
import { Action, BumpAction } from './actions';
import { Actor } from './actor';
import { GameMap } from './gamemap';

@serializable
export class Engine {
  constructor(public player: Actor, public gameMap: GameMap) {
    this.updateFov();
  }

  handleEnemyTurns(): void {
    this.gameMap.actors.forEach((a) => a.ai?.perform(this, a));
  }

  handleEvents(term: Terminal) {
    let action: Action | undefined = undefined;

    if (this.player.hp > 0) {
      const moveKey = term.getMovementKey();
      if (moveKey) {
        action = new BumpAction(this.player, moveKey.x, moveKey.y);
      }
    }

    if (action) {
      action.perform(this);
      this.handleEnemyTurns();
      this.updateFov();
    }
  }

  updateFov(): void {
    this.gameMap.updateFov(this.player.x, this.player.y);
  }

  render(term: Terminal) {
    // Clear the screen
    term.clear();

    // Draw the game map
    this.gameMap.render(term);
  }
}
