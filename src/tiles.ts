import { Cell, Colors, fromRgb } from 'wglt';

export interface Tile {
  walkable: boolean;
  transparent: boolean;
  dark: Cell;
  light: Cell;
}

export const floor = {
  walkable: true,
  transparent: true,
  dark: new Cell(0, 0, ' ', Colors.WHITE, fromRgb(50, 50, 150)),
  light: new Cell(0, 0, ' ', Colors.WHITE, fromRgb(200, 180, 50)),
};

export const wall = {
  walkable: false,
  transparent: false,
  dark: new Cell(0, 0, ' ', Colors.WHITE, fromRgb(0, 0, 100)),
  light: new Cell(0, 0, ' ', Colors.WHITE, fromRgb(130, 110, 50)),
};

export const stairs = {
  walkable: false,
  transparent: false,
  dark: new Cell(0, 0, '>', fromRgb(0, 0, 100), fromRgb(50, 50, 150)),
  light: new Cell(0, 0, '>', Colors.WHITE, fromRgb(200, 180, 50)),
};
