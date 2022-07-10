import { Terminal } from 'wglt';
import { Entity } from './entity';
import { GameMap } from './gamemap';

export class Engine {
  constructor(public entities: Entity[], public player: Entity, public gameMap: GameMap) {
    this.updateFov();
  }

  handleEvents(term: Terminal) {
    const moveKey = term.getMovementKey();
    if (moveKey && this.gameMap.isWalkable(this.player.x + moveKey.x, this.player.y + moveKey.y)) {
      this.player.x += moveKey.x;
      this.player.y += moveKey.y;
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

    // Draw the entities
    for (const entity of this.entities) {
      if (this.gameMap.isVisible(entity.x, entity.y)) {
        term.drawChar(entity.x, entity.y, entity.char, entity.color);
      }
    }
  }
}
