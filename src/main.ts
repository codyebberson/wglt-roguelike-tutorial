import { Colors, GUI, Key, Message, MessageDialog, Rect, ScrollableMessageDialog, SelectDialog, Terminal } from 'wglt';
import { Actor } from './actor';
import { Engine } from './engine';
import { loadGame, newGame, renderMainMenu, saveGame } from './menu';
import { levelUpSound, menuBlipSound } from './sounds';
import { zzfx } from './zzfx/zzfx';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

const crt = {
  scale: 3,
  blur: 0.5,
  curvature: 0.05,
  chroma: 0.5,
  vignette: 0.1,
  scanlineWidth: 0.75,
  scanlineIntensity: 0.25,
};

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT, { crt });
const gui = new GUI(term);
let engine: Engine | undefined = undefined;

openMainMenu();

term.update = () => {
  if (!gui.handleInput()) {
    if (engine) {
      if (term.isKeyPressed(Key.VK_I)) {
        openUseMenu(engine);
      } else if (term.isKeyPressed(Key.VK_D)) {
        openDropMenu(engine);
      } else if (term.isKeyPressed(Key.VK_V)) {
        openMessageLog(engine);
      } else if (term.isKeyPressed(Key.VK_C)) {
        openCharacterScreen(engine);
      } else {
        engine.handleEvents(term);
      }
    }
    if (term.isKeyPressed(Key.VK_ESCAPE)) {
      openMainMenu();
    }
  }

  if (engine) {
    engine.render(term);
  } else {
    renderMainMenu(term);
  }

  gui.draw();
};

function openMainMenu() {
  gui.add(
    new SelectDialog('Main Menu', ['New Game', 'Continue', 'Save Game', 'Load Game'], (selected) => {
      switch (selected) {
        case 0:
          setEngine(newGame());
          zzfx(...menuBlipSound);
          break;
        case 1:
          // Just close the menu
          zzfx(...menuBlipSound);
          break;
        case 2:
          saveGame(engine!);
          zzfx(...menuBlipSound);
          break;
        case 3:
          try {
            setEngine(loadGame());
            zzfx(...menuBlipSound);
          } catch (err) {
            gui.add(new MessageDialog('Error', 'Could not load saved game'));
          }
          break;
      }
    })
  );
}

function setEngine(newEngine: Engine): void {
  engine = newEngine;
  term.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, Colors.WHITE, Colors.BLACK);
}

function openUseMenu(engine: Engine) {
  const player = engine.player;
  gui.add(
    new SelectDialog(
      'Select an item to use',
      player.inventory.map((i) => i.name + (player.isEquipped(i) ? ' (equipped)' : '')),
      (selected) => {
        engine.handleAction(player.inventory[selected].getAction(player));
        zzfx(...menuBlipSound);
      }
    )
  );
  zzfx(...menuBlipSound);
}

function openDropMenu(engine: Engine) {
  const player = engine.player;
  gui.add(
    new SelectDialog(
      'Select an item to drop',
      player.inventory.map((i) => i.name),
      (selected) => {
        player.inventory.splice(selected, 1);
        zzfx(...menuBlipSound);
      }
    )
  );
  zzfx(...menuBlipSound);
}

function openMessageLog(engine: Engine) {
  gui.add(
    new ScrollableMessageDialog(
      new Rect(2, 2, SCREEN_WIDTH - 4, SCREEN_HEIGHT - 4),
      'Message Log',
      new Message(undefined, undefined, undefined, engine.messageLog.messages)
    )
  );
  zzfx(...menuBlipSound);
}

export function openLevelUpMenu(player: Actor): void {
  gui.add(
    new SelectDialog(
      'Level up! Select an attribute to increase.',
      [
        `Constitution (+20 HP, from ${player.maxHp})`,
        `Strength (+1 attack, from ${player.power})`,
        `Agility (+1 defense, from ${player.defense})`,
      ],
      (selected) => {
        switch (selected) {
          case 0:
            player.increaseMaxHp();
            break;
          case 1:
            player.increasePower();
            break;
          case 2:
            player.increaseDefense();
            break;
        }
        zzfx(...levelUpSound);
      }
    )
  );
  zzfx(...menuBlipSound);
}

function openCharacterScreen(engine: Engine) {
  const player = engine.player;
  gui.add(
    new MessageDialog(
      'Character',
      new Message(`Level:            ${player.level}`, Colors.WHITE, undefined, [
        new Message(`XP:               ${player.xp}`),
        new Message(`XP to next level: ${player.experienceToNextLevel}`),
        new Message(`Max HP:           ${player.maxHp}`),
        new Message(`HP:               ${player.hp}`),
        new Message(`Attack:           ${player.power}`),
        new Message(`Defense:          ${player.defense}`),
      ])
    )
  );
  zzfx(...menuBlipSound);
}
