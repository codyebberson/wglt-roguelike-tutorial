import { Colors, Terminal } from 'wglt';
import { Engine } from './engine';
import { Entity } from './entity';
import { generateDungeon } from './procgen';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);
const player = new Entity(40, 20, '@', Colors.WHITE);
const npc = new Entity(35, 20, '@', Colors.YELLOW);
const entities = [player, npc];
const gameMap = generateDungeon(MAX_ROOMS, ROOM_MIN_SIZE, ROOM_MAX_SIZE, MAP_WIDTH, MAP_HEIGHT, player);
const engine = new Engine(entities, player, gameMap);

term.update = () => {
  engine.handleEvents(term);
  engine.render(term);
};
