import { Console, deserialize, loadImage2x, serialize, Terminal } from 'wglt';
import { Colors } from './color';
import { Engine } from './engine';
import { dagger, leatherArmor } from './entities';
import { Equipment } from './equipment';

let img = undefined as Console | undefined;
loadImage2x('menu.png', (result) => (img = result));

export function renderMainMenu(term: Terminal): void {
  if (img) {
    term.drawConsole(0, 0, img, 0, 0, 80, 45);
  }

  const centerX = Math.round(term.width / 2);
  const centerY = Math.round(term.height / 2);
  term.drawCenteredString(centerX, centerY - 8, 'TOMBS OF ANCIENT KINGS', Colors.MENU_TITLE);
  term.drawCenteredString(centerX, term.height - 2, 'By Cody Ebberson', Colors.MENU_TITLE);
}

export function newGame(): Engine {
  const engine = new Engine();
  engine.generateFloor();
  engine.log('Hello and welcome, adventurer, to yet another dungeon!', Colors.WELCOME_TEXT);

  const player = engine.player;
  const playerDagger = deserialize(serialize(dagger)) as Equipment;
  const playerArmor = deserialize(serialize(leatherArmor)) as Equipment;

  dagger.parent = player;
  leatherArmor.parent = player;

  player.inventory.push(playerDagger);
  player.equip(playerDagger);

  player.inventory.push(playerArmor);
  player.equip(playerArmor);

  return engine;
}

export function saveGame(engine: Engine): void {
  localStorage.setItem('savegame', serialize(engine));
}

export function loadGame(): Engine {
  return deserialize(localStorage.getItem('savegame') || '') as Engine;
}
