import { App, Rect, Game, Vec2 } from 'wglt';
import { Player } from './player';
import { MAP_WIDTH, MAP_HEIGHT, MapGenerator } from './mapgen';

// Create a new application.
// WGLT App sets up the canvas, WebGL, keyboard, mouse, etc.
const app = new App({
  canvas: document.querySelector('canvas') as HTMLCanvasElement,
  imageUrl: 'graphics.png',
  size: new Rect(0, 0, 224, 400),
  fillWindow: true,
});

// Create a new game.
// WGLT Game manages entities, turns, player input, etc.
const game = new Game(app, {
  mapSize: new Rect(0, 0, MAP_WIDTH, MAP_HEIGHT),
  horizontalViewDistance: 5,
  verticalViewDistance: 5,
  focusMargins: new Vec2(0, 40),
});

// Create the player.
// See the Player class for more details.
// Our player is a special entity that receives user input.
const player = new Player(game, 32, 32);
game.player = player;
game.entities.add(player);

// Create the map.
new MapGenerator(game).makeMap();

// Finally, set the game to be the active state.
// (Apps can have different states, such as menus)
app.state = game;
