import { Color, serializable, Terminal } from 'wglt';
import { Action } from './actions';
import { Actor } from './actor';
import { ERROR_COLOR, WHITE } from './color';
import { GameMap } from './gamemap';
import { EventHandler, MainGameEventHandler } from './handlers';
import { MessageLog } from './messagelog';
import { renderBar, renderNames } from './utils';

@serializable
export class Engine {
  readonly messageLog = new MessageLog();
  eventHandler: EventHandler;

  constructor(public player: Actor, public gameMap: GameMap) {
    this.updateFov();
    this.eventHandler = new MainGameEventHandler(this);
  }

  log(text: string, fg: Color = WHITE): void {
    this.messageLog.add(text, fg);
  }

  handleEnemyTurns(): void {
    this.gameMap.actors.forEach((a) => {
      try {
        a.ai?.perform(this, a);
      } catch (err) {
        console.error('Unhandled AI error:', err);
      }
    });
  }

  handleEvents(term: Terminal) {
    if (this.player.hp > 0) {
      this.eventHandler.handleEvents(term);
    }
  }

  handleAction(action: Action | undefined): void {
    if (!action) {
      return;
    }

    try {
      action.perform(this);
    } catch (err) {
      this.log((err as Error).message, ERROR_COLOR);
      return;
    }

    this.handleEnemyTurns();
    this.updateFov();
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
