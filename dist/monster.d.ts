import { Sprite, Game } from 'wglt';
import { Fighter } from './fighter';
import { Player } from './player';
export declare class Monster extends Fighter {
    constructor(game: Game, x: number, y: number, name: string, sprite: Sprite);
    onBump(player: Player): boolean;
    onDeath(attacker: Fighter): void;
    private calculateDamage;
}
