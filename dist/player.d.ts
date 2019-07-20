import { Game } from 'wglt';
import { Fighter } from './fighter';
/**
 * The Player class represents a player.
 * Player extends Actor, which is an Entity that can move and attack.
 */
export declare class Player extends Fighter {
    constructor(game: Game, x: number, y: number);
}
