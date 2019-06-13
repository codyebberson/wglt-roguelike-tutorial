import { Sprite } from 'wglt';

/**
 * The Sprites constants contains sprites from the sprite sheet.
 *
 * A Sprite is defined by its initial rectangle (x, y, width, height),
 * and then optional animation details.
 *
 * For example, each of the actors are animated with 2 frames.
 * Each of the items have only 1 frame.
 */
export class Sprites {
  // Actors
  static readonly PLAYER = new Sprite(0, 16, 16, 16, 2, true);
  static readonly ORC = new Sprite(32, 16, 16, 16, 2, true);
  static readonly TROLL = new Sprite(64, 16, 16, 16, 2, true);

  // Items
  static readonly HEALTH_POTION = new Sprite(0, 32, 16, 16);
  static readonly FIREBALL_SCROLL = new Sprite(16, 32, 16, 16);
  static readonly LIGHTNING_SCROLL = new Sprite(32, 32, 16, 16);
  static readonly CONFUSE_SCROLL = new Sprite(48, 32, 16, 16);
  static readonly DAGGER = new Sprite(64, 32, 16, 16);
  static readonly SWORD = new Sprite(80, 32, 16, 16);
  static readonly SHIELD = new Sprite(96, 32, 16, 16);
}
