import { Colors, GUI, Key, Message, Rect, ScrollableMessageDialog, Terminal } from 'wglt';
import { Actor } from './actor';
import { WELCOME_TEXT_COLOR } from './color';
import { Engine } from './engine';
import { generateDungeon } from './procgen';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const MAP_WIDTH = SCREEN_WIDTH;
const MAP_HEIGHT = SCREEN_HEIGHT - 7;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_MONSTERS_PER_ROOM = 2;

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);

const gui = new GUI(term);

const player = new Actor('@', Colors.WHITE, 'Player', true, 30, 30, 2, 5);

const gameMap = generateDungeon(
  MAX_ROOMS,
  ROOM_MIN_SIZE,
  ROOM_MAX_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  MAX_MONSTERS_PER_ROOM,
  player
);

const engine = new Engine(player, gameMap);
engine.log('Hello and welcome, adventurer, to yet another dungeon!', WELCOME_TEXT_COLOR);

term.update = () => {
  if (!gui.handleInput()) {
    if (term.isKeyPressed(Key.VK_V)) {
      gui.add(
        new ScrollableMessageDialog(
          new Rect(2, 2, SCREEN_WIDTH - 4, SCREEN_HEIGHT - 4),
          'Message Log',
          new Message(undefined, undefined, undefined, engine.messageLog.messages)
        )
      );
    } else {
      engine.handleEvents(term);
    }
  }

  engine.render(term);
  gui.draw();
};
