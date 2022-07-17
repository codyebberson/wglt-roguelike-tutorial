import { Colors, Terminal } from 'wglt';
import { Actor } from './actor';
import { Engine } from './engine';
import { generateDungeon } from './procgen';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_MONSTERS_PER_ROOM = 2;

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);

const player = new Actor(40, 20, '@', Colors.WHITE, 'Player', true, 30, 30, 2, 5);

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

term.update = () => {
  engine.handleEvents(term);
  engine.render(term);
};
