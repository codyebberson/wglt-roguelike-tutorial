import { App, Rect, Game, Vec2 } from 'wglt';
import { Player } from './player';
import { Tiles } from './tiles';

// Map constants
const MAP_WIDTH = 64;
const MAP_HEIGHT = 64;

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

// Create the map.
// A Game object includes an empty map by default.
// For now, we're going to set all tiles to non-blocking floor tiles.
for (let y = 1; y < MAP_HEIGHT - 1; y++) {
  for (let x = 1; x < MAP_WIDTH - 1; x++) {
    game.tileMap.setTile(x, y, 0, Tiles.FLOOR);
    game.tileMap.setBlocked(x, y, false);
  }
}

// Add some test walls
game.tileMap.setTile(30, 32, 0, Tiles.WALL1);
game.tileMap.setBlocked(30, 32, true);
game.tileMap.setTile(34, 32, 0, Tiles.WALL1);
game.tileMap.setBlocked(34, 32, true);

// Create the player.
// See the Player class for more details.
// Our player is a special entity that receives user input.
const player = new Player(game, 32, 32);
game.player = player;
game.entities.add(player);

// Now that we have a player and an empty map,
// reset the viewport to be centered on the player
// and recompute the field-of-view.
game.resetViewport();
game.recomputeFov();

// Finally, set the game to be the active state.
// (Apps can have different states, such as menus)
app.state = game;
