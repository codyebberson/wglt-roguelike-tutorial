import { Cell, Colors, computePath, Console, Point, PointLike, Rect, serializable, Terminal } from 'wglt';
import { Actor } from './actor';
import { BaseComponent } from './base';
import { Engine } from './engine';
import { Entity } from './entity';
import { Item } from './item';
import { floor, stairs, Tile, wall } from './tiles';

@serializable
export class GameMap extends BaseComponent {
  private tileMap: Tile[][];
  private console: Console;
  level = 0;
  stairsLocation = new Point(0, 0);

  constructor(engine: Engine, public width: number, public height: number, public entities: Entity[]) {
    super(engine);

    this.tileMap = [];
    this.console = new Console(width, height);

    for (let y = 0; y < height; y++) {
      this.tileMap.push([]);
      for (let x = 0; x < width; x++) {
        this.tileMap[y].push(wall);
        this.makeWall(x, y);
      }
    }
  }

  get actors(): Actor[] {
    return this.entities.filter((e) => e instanceof Actor && e.blocks) as Actor[];
  }

  get items(): Item[] {
    return this.entities.filter((e) => e instanceof Item) as Item[];
  }

  createRoom(room: Rect): void {
    for (let y = room.y + 1; y < room.y2; y++) {
      for (let x = room.x + 1; x < room.x2; x++) {
        this.makeFloor(x, y);
      }
    }
  }

  createHTunnel(x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      this.makeFloor(x, y);
    }
  }

  createVTunnel(y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      this.makeFloor(x, y);
    }
  }

  makeStairs(x: number, y: number): void {
    this.makeFloor(x, y);
    this.stairsLocation = new Point(x, y);
    this.tileMap[y][x] = stairs;
  }

  updateFov(x: number, y: number): void {
    this.console.computeFov(x, y, 8);
    this.console.updateExplored();
  }

  isVisible(x: number, y: number): boolean {
    return this.console.isVisible(x, y);
  }

  isWall(x: number, y: number): boolean {
    return this.console.isBlocked(x, y);
  }

  getBlockingEntity(x: number, y: number): Entity | undefined {
    return this.entities.find((e) => e.blocks && e.x === x && e.y === y);
  }

  getActor(x: number, y: number): Actor | undefined {
    return this.actors.find((e) => e.x === x && e.y === y) as Actor | undefined;
  }

  getItem(x: number, y: number): Item | undefined {
    return this.items.find((e) => e.x === x && e.y === y) as Item | undefined;
  }

  computePath(start: PointLike, end: PointLike): Cell[] | undefined {
    return computePath(this.console, start, end, 1000);
  }

  render(term: Terminal): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tileMap[y][x];
        if (this.isVisible(x, y)) {
          term.drawCell(x, y, tile.light);
        } else if (this.console.grid[y][x].explored) {
          term.drawCell(x, y, tile.dark);
        } else {
          term.drawChar(x, y, 0, Colors.BLACK, Colors.BLACK);
        }
      }
    }

    this.entities.sort((a, b) => a.renderOrder - b.renderOrder);

    for (const entity of this.entities) {
      if (this.isVisible(entity.x, entity.y)) {
        term.drawChar(entity.x, entity.y, entity.char, entity.color);
      }
    }
  }

  private makeWall(x: number, y: number): void {
    this.tileMap[y][x] = wall;
    this.console.setBlocked(x, y, true);
    this.console.setBlockedSight(x, y, true);
  }

  private makeFloor(x: number, y: number): void {
    this.tileMap[y][x] = floor;
    this.console.setBlocked(x, y, false);
    this.console.setBlockedSight(x, y, false);
  }
}
