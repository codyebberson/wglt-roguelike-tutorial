import { getTileId } from 'wglt';

/**
 * The Tiles constants contains tile ID's.
 *
 * In WGLT, a tile ID is a single number similar to the "Tiled" map editor.
 * WGLT provides a helper method called "getTileId" to convert x,y to ID.
 */
export enum Tiles {
  FLOOR = getTileId(0, 3),
  WALL1 = getTileId(1, 3),
  WALL2 = getTileId(2, 3),
  WALL3 = getTileId(3, 3),
}
