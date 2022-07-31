import { Colors, Console, deserialize, loadImage2x, serialize, Terminal } from 'wglt';
import { Actor } from './actor';
import { MENU_TITLE_COLOR, WELCOME_TEXT_COLOR } from './color';
import { Engine } from './engine';
import { generateDungeon } from './procgen';

const MAP_WIDTH = 80;
const MAP_HEIGHT = 38;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_MONSTERS_PER_ROOM = 2;
const MAX_ITEMS_PER_ROOM = 2;

let img = undefined as Console | undefined;
loadImage2x('menu.png', (result) => (img = result));

export function renderMainMenu(term: Terminal): void {
  if (img) {
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  const centerX = Math.round(term.width / 2);
  const centerY = Math.round(term.height / 2);
  term.drawCenteredString(centerX, centerY - 8, 'TOMBS OF ANCIENT KINGS', MENU_TITLE_COLOR);
  term.drawCenteredString(centerX, term.height - 2, 'By Cody Ebberson', MENU_TITLE_COLOR);
}

export function newGame(): Engine {
  const player = new Actor('@', Colors.WHITE, 'Player', true, 30, 30, 2, 5);
  const gameMap = generateDungeon(
    MAX_ROOMS,
    ROOM_MIN_SIZE,
    ROOM_MAX_SIZE,
    MAP_WIDTH,
    MAP_HEIGHT,
    MAX_MONSTERS_PER_ROOM,
    MAX_ITEMS_PER_ROOM,
    player
  );
  const engine = new Engine(player, gameMap);
  engine.log('Hello and welcome, adventurer, to yet another dungeon!', WELCOME_TEXT_COLOR);
  return engine;
}

export function saveGame(engine: Engine): void {
  localStorage.setItem('savegame', serialize(engine));
}

export function loadGame(): Engine {
  return deserialize(localStorage.getItem('savegame') || '') as Engine;
}
