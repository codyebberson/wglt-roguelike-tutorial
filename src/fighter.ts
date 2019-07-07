import { Actor, Sprite, Game } from 'wglt';

export class Fighter extends Actor {
  defense: number;
  power: number;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite, true);
    this.defense = 0;
    this.power = 0;
  }
}
