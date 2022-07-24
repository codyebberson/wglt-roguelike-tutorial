import { fromRgb } from 'wglt';
import { Actor } from './actor';
import { HostileEnemy } from './ai';

export const orc = new Actor(
  'o', // character
  fromRgb(63, 127, 63), // color
  'orc', // name
  true, // blocks
  10, // max hp
  10, // hp
  0, // defense
  3, // power
  new HostileEnemy()
);

export const troll = new Actor(
  'T', // character
  fromRgb(0, 127, 0), // color
  'troll', // name
  true, // blocks
  16, // max hp
  16, // hp
  1, // defense
  4, // power
  new HostileEnemy()
);
