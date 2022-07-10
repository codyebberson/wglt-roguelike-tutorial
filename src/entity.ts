import { Color } from 'wglt';
import { GameMap } from './gamemap';

export class Entity {
  constructor(
    public x: number,
    public y: number,
    public char: string,
    public color: Color,
    public name: string,
    public blocks: boolean
  ) {}

  spawn(gameMap: GameMap, x: number, y: number): Entity {
    const clone = new Entity(x, y, this.char, this.color, this.name, this.blocks);
    gameMap.entities.push(clone);
    return clone;
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
