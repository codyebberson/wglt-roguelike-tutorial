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
export declare class Sprites {
    static readonly PLAYER: Sprite;
    static readonly ORC: Sprite;
    static readonly TROLL: Sprite;
    static readonly HEALTH_POTION: Sprite;
    static readonly FIREBALL_SCROLL: Sprite;
    static readonly LIGHTNING_SCROLL: Sprite;
    static readonly CONFUSE_SCROLL: Sprite;
    static readonly DAGGER: Sprite;
    static readonly SWORD: Sprite;
    static readonly SHIELD: Sprite;
}
