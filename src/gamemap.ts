import { Rect } from 'rect';
import { Console, Terminal } from 'wglt';
import { floor, wall } from './tiles';

export class GameMap {
  private console: Console;
  constructor(public width: number, public height: number) {
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

  isWalkable(x: number, y: number): boolean {
    return !this.console.isBlocked(x, y);
  }

  render(term: Terminal): void {
    term.drawConsole(0, 0, this.console, 0, 0, this.width, this.height);
  }

  private makeWall(x: number, y: number): void {
    this.console.drawCell(x, y, wall);
    this.console.setBlocked(x, y, true);
  }

  private makeFloor(x: number, y: number): void {
    this.console.drawCell(x, y, floor);
    this.console.setBlocked(x, y, false);
  }
}
