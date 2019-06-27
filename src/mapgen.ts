import { Game, TileMap, Rect, RNG, Actor } from 'wglt';
import { Tiles } from './tiles';
import { Player } from './player';
import { Sprites } from './sprites';

// Map constants
export const MAP_WIDTH = 64;
export const MAP_HEIGHT = 64;

const MAX_ROOMS = 30;
const ROOM_MIN_SIZE = 6;
const ROOM_MAX_SIZE = 10;

const MAX_MONSTERS_PER_ROOM = 3;

export class MapGenerator {
  readonly game: Game;
  readonly map: TileMap;
  readonly rng: RNG;

  constructor(game: Game) {
    this.game = game;
    this.map = game.tileMap;
    this.rng = game.rng;
  }

  makeMap() {
    this.clearMap();

    const rooms = [];

    for (let r = 0; r < MAX_ROOMS; r++) {
      // Random width and height
      const w = this.rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
      const h = this.rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

      // Random position without going out of the boundaries of the map
      const x = this.rng.nextRange(2, MAP_WIDTH - w - 4);
      const y = this.rng.nextRange(2, MAP_HEIGHT - h - 4);

      // "Rect" class makes rectangles easier to work with
      const newRoom = new Rect(x, y, w, h);

      // Run through the other rooms and see if they intersect with this one
      let intersects = false;
      for (let i = 0; i < rooms.length; i++) {
        if (newRoom.intersects(rooms[i])) {
          intersects = true;
          break;
        }
      }

      if (!intersects) {
        // This means there are no intersections, so this room is valid

        // "paint" it to the map's tiles
        this.createRoom(newRoom);

        // Center coordinates of new room, will be useful later
        const center = newRoom.getCenter();

        if (rooms.length === 0) {
          // This is the first room, where the player starts at
          const player = this.game.player as Player;
          player.x = center.x;
          player.y = center.y;
        } else {
          // All rooms after the first:
          // Connect it to the previous room with a tunnel

          // Center coordinates of previous room
          const prevCenter = rooms[rooms.length - 1].getCenter();

          // Flip a coin (random number that is either 0 or 1)
          if (this.rng.nextRange(0, 2) === 0) {
            this.createHTunnel(prevCenter.x, center.x, prevCenter.y);
            this.createVTunnel(prevCenter.y, center.y, center.x);
          } else {
            this.createVTunnel(prevCenter.y, center.y, prevCenter.x);
            this.createHTunnel(prevCenter.x, center.x, center.y);
          }
        }

        this.placeEntities(newRoom);

        // Finally, append the new room to the list
        rooms.push(newRoom);
      }
    }

    // Now that we have a player and an empty map,
    // reset the viewport to be centered on the player
    // and recompute the field-of-view.
    this.game.resetViewport();
    this.game.recomputeFov();
  }

  private clearMap() {
    for (let y = 1; y < MAP_HEIGHT - 1; y++) {
      for (let x = 1; x < MAP_WIDTH - 1; x++) {
        this.map.setTile(x, y, 0, this.randomWall());
        this.map.setBlocked(x, y, true);
      }
    }
  }

  private createRoom(room: Rect) {
    for (let y = room.y1; y < room.y2; y++) {
      for (let x = room.x1; x < room.x2; x++) {
        this.map.setTile(x, y, 0, Tiles.FLOOR);
        this.map.setBlocked(x, y, false);
      }
    }
  }

  private createHTunnel(x1: number, x2: number, y: number) {
    for (let x = Math.min(x1, x2); x < Math.max(x1, x2); x++) {
      this.map.setTile(x, y, 0, Tiles.FLOOR);
      this.map.setBlocked(x, y, false);
    }
  }

  private createVTunnel(y1: number, y2: number, x: number) {
    for (let y = Math.min(y1, y2); y < Math.max(y1, y2); y++) {
      this.map.setTile(x, y, 0, Tiles.FLOOR);
      this.map.setBlocked(x, y, false);
    }
  }

  private placeEntities(room: Rect) {
    // Get a random number of monsters
    const numMonsters = this.rng.nextRange(0, MAX_MONSTERS_PER_ROOM + 1);
    for (let i = 0; i < numMonsters; i++) {
      // Choose a random location in the room
      const x = this.rng.nextRange(room.x1 + 1, room.x2 - 1);
      const y = this.rng.nextRange(room.y1 + 1, room.y2 - 1);
      if (!this.game.getEntityAt(x, y)) {
        let monster;
        if (this.rng.nextRange(0, 100) < 80) {
          monster = new Actor(this.game, x, y, 'Orc', Sprites.ORC, true);
        } else {
          monster = new Actor(this.game, x, y, 'Troll', Sprites.TROLL, true);
        }
        this.game.entities.add(monster);
      }
    }
  }

  private randomWall() {
    const r = this.rng.nextRange(0, 3);
    if (r === 0) {
      return Tiles.WALL1;
    } else if (r === 1) {
      return Tiles.WALL2;
    } else {
      return Tiles.WALL3;
    }
  }
}
