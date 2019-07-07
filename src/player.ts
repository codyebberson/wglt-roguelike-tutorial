import { Game } from 'wglt';
import { Sprites } from './sprites';
import { Fighter } from './fighter';

/**
 * The Player class represents a player.
 * Player extends Actor, which is an Entity that can move and attack.
 */
export class Player extends Fighter {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', Sprites.PLAYER);
    this.hp = 30;
    this.maxHp = 30;
    this.defense = 2;
    this.power = 5;
  }
}
