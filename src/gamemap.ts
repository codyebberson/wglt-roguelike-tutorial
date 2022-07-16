import { Colors, Console, fromRgb, Rect, Terminal } from 'wglt';
import { Entity } from './entity';
import { floor, wall } from './tiles';

const COLOR_DARK_WALL = fromRgb(0, 0, 100);
const COLOR_LIGHT_WALL = fromRgb(130, 110, 50);
const COLOR_DARK_GROUND = fromRgb(50, 50, 150);
const COLOR_LIGHT_GROUND = fromRgb(200, 180, 50);

export class GameMap {
  private console: Console;
  constructor(public width: number, public height: number, public entities: Entity[]) {
    this.console = new Console(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.makeWall(x, y);
      }
    }
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

  updateFov(x: number, y: number): void {
    this.console.computeFov(x, y, 8);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const visible = this.console.isVisible(x, y);
        if (visible) {
          this.console.grid[y][x].explored = true;
        }
      }
    }
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

  render(term: Terminal): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const visible = this.isVisible(x, y);
        const wall = this.console.grid[y][x].blockedSight;
        let color = Colors.BLACK;

        if (visible) {
          // It's visible
          color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
        } else if (this.console.grid[y][x].explored) {
          // It's remembered
          color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
        }

        term.drawChar(x, y, 0, 0, color);
      }
    }

    for (const entity of this.entities) {
      if (this.isVisible(entity.x, entity.y)) {
        term.drawChar(entity.x, entity.y, entity.char, entity.color);
      }
    }
  }

  private makeWall(x: number, y: number): void {
    this.console.drawCell(x, y, wall);
    this.console.setBlocked(x, y, true);
    this.console.setBlockedSight(x, y, true);
  }

  private makeFloor(x: number, y: number): void {
    this.console.drawCell(x, y, floor);
    this.console.setBlocked(x, y, false);
    this.console.setBlockedSight(x, y, false);
  }
}
