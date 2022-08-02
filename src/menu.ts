import { Console, deserialize, loadImage2x, serialize, Terminal } from 'wglt';
import { MENU_TITLE_COLOR, WELCOME_TEXT_COLOR } from './color';
import { Engine } from './engine';

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
  const engine = new Engine();
  engine.generateFloor();
  engine.log('Hello and welcome, adventurer, to yet another dungeon!', WELCOME_TEXT_COLOR);
  return engine;
}

export function saveGame(engine: Engine): void {
  localStorage.setItem('savegame', serialize(engine));
}

export function loadGame(): Engine {
  return deserialize(localStorage.getItem('savegame') || '') as Engine;
}
