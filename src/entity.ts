import { Color, deserialize, serialize } from 'wglt';
import { GameMap } from './gamemap';

export const RenderOrder = {
  CORPSE: 0,
  ITEM: 1,
  ACTOR: 2,
};

export abstract class Entity {
  constructor(
    public x: number,
    public y: number,
    public char: string,
    public color: Color,
    public name: string,
    public blocks = false,
    public renderOrder = 0
  ) {}

  spawn(gameMap: GameMap, x: number, y: number): Entity {
    const clone = deserialize(serialize(this)) as Entity;
    clone.x = x;
    clone.y = y;
    gameMap.entities.push(clone);
    return clone;
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
