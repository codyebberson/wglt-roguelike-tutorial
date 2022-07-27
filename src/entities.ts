import { fromRgb } from 'wglt';
import { Actor } from './actor';
import { HostileEnemy } from './ai';
import { ConfusionItem, FireballDamageItem, HealingItem, LightningDamageItem } from './item';

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

export const healingItem = new HealingItem(
  '!', // character
  fromRgb(127, 0, 255), // color
  'Health Potion', // name
  4 // amount
);

export const lightningScroll = new LightningDamageItem(
  '~', // character
  fromRgb(255, 255, 0), // color
  'Lightning Scroll', // name
  20, // damage
  5 // max range
);

export const confusionScroll = new ConfusionItem(
  '~', // character
  fromRgb(207, 63, 255), // color
  'Confusion Scroll', // name
  10 // number of turns
);

export const fireballScroll = new FireballDamageItem(
  '~', // character
  fromRgb(255, 0, 0), // color
  'Fireball Scroll', // name
  12, // damage
  3 // radius
);
