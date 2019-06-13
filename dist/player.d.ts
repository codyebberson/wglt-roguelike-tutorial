import { Game, Actor } from 'wglt';
/**
 * The Player class represents a player.
 * Player extends Actor, which is an Entity that can move and attack.
 */
export declare class Player extends Actor {
    constructor(game: Game, x: number, y: number);
}
