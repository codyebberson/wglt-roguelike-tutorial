import { Actor, Sprite, Game } from 'wglt';
export declare class Fighter extends Actor {
    defense: number;
    power: number;
    constructor(game: Game, x: number, y: number, name: string, sprite: Sprite);
}
