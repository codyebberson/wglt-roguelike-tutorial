import { fromRgb } from 'wglt';
import { Entity } from './entity';

export const orcType = new Entity(0, 0, 'o', fromRgb(63, 127, 63), 'orc', true);

export const trollType = new Entity(0, 0, 'T', fromRgb(0, 127, 0), 'troll', true);
