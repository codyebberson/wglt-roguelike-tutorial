import { Game, Actor } from 'wglt';
import { Sprites } from './sprites';

/**
 * The Player class represents a player.
 * Player extends Actor, which is an Entity that can move and attack.
 */
export class Player extends Actor {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', Sprites.PLAYER, true);
    this.hp = 10;
    this.maxHp = 10;
  }
}
