import { App, Rect, Game, Vec2, MessageLog, StandardColors, Panel } from 'wglt';
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
  horizontalViewDistance: 6,
  verticalViewDistance: 6,
  focusMargins: new Vec2(0, 40),
});

// Create a message log.
// Attach it to the bottom left corner of the screen.
game.messageLog = new MessageLog(new Rect(1, -50, 100, 50));
game.gui.add(game.messageLog);
game.log('Welcome stranger! Prepare to perish!', StandardColors.RED);

// Create the player stats overlay.
const playerStats = new Panel(new Rect(1, 1, 100, 100));
playerStats.drawContents = function () {
  const frameY = 0;
  app.drawString(player.name, 1, frameY);

  const hpPercent = player.hp / player.maxHp;
  app.drawImage(0, frameY + 7, 32, 64, 32, 12);
  app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 28));
  app.drawString(player.hp + '/' + player.maxHp, 3, frameY + 10);
};
game.gui.add(playerStats);

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
