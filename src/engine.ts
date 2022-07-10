import { Terminal } from 'wglt';
import { Action, BumpAction } from './actions';
import { Entity } from './entity';
import { GameMap } from './gamemap';

export class Engine {
  constructor(public player: Entity, public gameMap: GameMap) {
    this.updateFov();
  }

  handleEnemyTurns(): void {
    for (const entity of this.gameMap.entities) {
      console.log(`The ${entity.name} wonders when it will get to take a real turn.`);
    }
  }

  handleEvents(term: Terminal) {
    const moveKey = term.getMovementKey();
    let action: Action | undefined = undefined;
    if (moveKey) {
      action = new BumpAction(moveKey.x, moveKey.y);
    }

    if (action) {
      action.perform(this, this.player);
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
