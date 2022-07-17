import { Color, serializable, Terminal } from 'wglt';
import { Action, BumpAction } from './actions';
import { Actor } from './actor';
import { WHITE } from './color';
import { GameMap } from './gamemap';
import { MessageLog } from './messagelog';
import { renderBar, renderNames } from './utils';

@serializable
export class Engine {
  readonly messageLog = new MessageLog();

  constructor(public player: Actor, public gameMap: GameMap) {
    this.updateFov();
  }

  log(text: string, fg: Color = WHITE): void {
    this.messageLog.add(text, fg);
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

    // Message log
    this.messageLog.render(term, 21, 40, 40, 5);

    // Health bar
    renderBar(term, this.player.hp, this.player.maxHp, 20);

    // Names at mouse location
    renderNames(term, this.gameMap, term.mouse.x, term.mouse.y);
  }
}
