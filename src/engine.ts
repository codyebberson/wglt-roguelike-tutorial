import { Color, Colors, RNG, serializable, Terminal } from 'wglt';
import { Action } from './actions';
import { Actor } from './actor';
import { ERROR_COLOR, WHITE } from './color';
import { GameMap } from './gamemap';
import { EventHandler, MainGameEventHandler } from './handlers';
import { MessageLog } from './messagelog';
import { generateDungeon } from './procgen';
import { renderBar, renderDungeonLevel, renderNames } from './utils';

const MAP_WIDTH = 80;
const MAP_HEIGHT = 38;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_MONSTERS_PER_ROOM = 2;
const MAX_ITEMS_PER_ROOM = 2;

@serializable
export class Engine {
  readonly rng = new RNG();
  readonly player = new Actor('@', Colors.WHITE, 'Player', true, 30, 30, 2, 5);
  readonly messageLog = new MessageLog();
  eventHandler: EventHandler = new MainGameEventHandler(this);
  gameMap: GameMap = new GameMap(1, 1, []);

  log(text: string, fg: Color = WHITE): void {
    this.messageLog.add(text, fg);
  }

  generateFloor(): void {
    this.gameMap = generateDungeon(
      this,
      this.gameMap.level + 1,
      MAX_ROOMS,
      ROOM_MIN_SIZE,
      ROOM_MAX_SIZE,
      MAP_WIDTH,
      MAP_HEIGHT,
      MAX_MONSTERS_PER_ROOM,
      MAX_ITEMS_PER_ROOM
    );
    this.updateFov();
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

    // Draw overlay for input handler
    this.eventHandler.onRender(term);

    // Message log
    this.messageLog.render(term, 21, 40, 40, 5);

    // Health bar
    renderBar(term, this.player.hp, this.player.maxHp, 20);

    renderDungeonLevel(term, this.gameMap.level, 0, 42);

    // Names at mouse location
    renderNames(term, this.gameMap, term.mouse.x, term.mouse.y);
  }
}
