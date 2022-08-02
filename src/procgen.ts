import { Rect, RNG } from 'wglt';
import { Engine } from './engine';
import { confusionScroll, fireballScroll, healingItem, lightningScroll, orc, troll } from './entities';
import { GameMap } from './gamemap';

/**
 * Procedurally generates a dungeon.
 * @param engine The game engine.
 * @param level The dungeon level.
 * @param maxRooms The maximum number of rooms allowed in the dungeon. We’ll use this to control our iteration.
 * @param roomMinSize The minimum size of one room.
 * @param roomMaxSize The maximum size of one room.
 * @param mapWidth The width of the GameMap to create.
 * @param mapHeight The height of the GameMap to create.
 * @param maxMonstersPerRoom The maximum number of monsters per room.
 * @param maxItemsPerRoom The maximum number of items per room.
 * @returns A new dungeon.
 */
export function generateDungeon(
  engine: Engine,
  level: number,
  maxRooms: number,
  roomMinSize: number,
  roomMaxSize: number,
  mapWidth: number,
  mapHeight: number,
  maxMonstersPerRoom: number,
  maxItemsPerRoom: number
): GameMap {
  const { rng, player } = engine;

  const dungeon = new GameMap(mapWidth, mapHeight, [player]);
  dungeon.level = level;

  const rooms: Rect[] = [];
  let center = undefined;

  for (let r = 0; r < maxRooms; r++) {
    const w = rng.nextRange(roomMinSize, roomMaxSize);
    const h = rng.nextRange(roomMinSize, roomMaxSize);

    const x = rng.nextRange(0, mapWidth - w - 1);
    const y = rng.nextRange(0, mapHeight - h - 1);

    // "Rect" class makes rectangles easier to work with
    const newRoom = new Rect(x, y, w, h);

    // Run through the other rooms and see if they intersect with this one
    if (rooms.some((room) => room.intersects(newRoom))) {
      // This room intersects, so go to the next attempt.
      continue;
    }

    // Dig out this rooms inner area.
    dungeon.createRoom(newRoom);

    // Center coordinates of new room, will be useful later
    center = newRoom.getCenter();

    if (rooms.length === 0) {
      // This is the first room, where the player starts at
      player.x = center.x;
      player.y = center.y;
    } else {
      // All rooms after the first:
      // Dig out a tunnel between this room and the previous one.
      // Center coordinates of previous room
      const prev = rooms[rooms.length - 1].getCenter();
      if (rng.nextRange(0, 1) === 1) {
        // First move horizontally, then vertically
        dungeon.createHTunnel(prev.x, center.x, prev.y);
        dungeon.createVTunnel(prev.y, center.y, center.x);
      } else {
        // First move vertically, then horizontally
        dungeon.createVTunnel(prev.y, center.y, prev.x);
        dungeon.createHTunnel(prev.x, center.x, center.y);
      }
    }

    placeEntities(rng, newRoom, dungeon, maxMonstersPerRoom, maxItemsPerRoom);

    dungeon.makeStairs(center.x, center.y);

    // Finally, append the new room to the list
    rooms.push(newRoom);
  }

  return dungeon;
}

function placeEntities(rng: RNG, room: Rect, dungeon: GameMap, maxMonsters: number, maxItems: number): void {
  const numMonsters = rng.nextRange(0, maxMonsters + 1);
  const numItems = rng.nextRange(0, maxItems + 1);

  for (let i = 0; i < numMonsters; i++) {
    const x = rng.nextRange(room.x + 1, room.x2 - 1);
    const y = rng.nextRange(room.y + 1, room.y2 - 1);

    if (!dungeon.getBlockingEntity(x, y)) {
      if (rng.nextFloat() < 0.8) {
        orc.spawn(dungeon, x, y);
      } else {
        troll.spawn(dungeon, x, y);
      }
    }
  }

  for (let i = 0; i < numItems; i++) {
    const x = rng.nextRange(room.x + 1, room.x2 - 1);
    const y = rng.nextRange(room.y + 1, room.y2 - 1);

    if (!dungeon.getBlockingEntity(x, y)) {
      const itemChance = rng.nextFloat();
      if (itemChance < 0.7) {
        healingItem.spawn(dungeon, x, y);
      } else if (itemChance < 0.8) {
        fireballScroll.spawn(dungeon, x, y);
      } else if (itemChance < 0.9) {
        confusionScroll.spawn(dungeon, x, y);
      } else {
        lightningScroll.spawn(dungeon, x, y);
      }
    }
  }
}
