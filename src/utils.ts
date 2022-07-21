import { capitalize, Console } from 'wglt';
import { BAR_EMPTY_COLOR, BAR_FILLED_COLOR, BAR_TEXT_COLOR, WHITE } from './color';
import { GameMap } from './gamemap';

export function renderBar(console: Console, value: number, max: number, width: number): void {
  const barWidth = Math.round((value / max) * width);
  console.fillRect(0, 40, width, 1, ' ', BAR_TEXT_COLOR, BAR_EMPTY_COLOR);
  console.fillRect(0, 40, barWidth, 1, ' ', BAR_TEXT_COLOR, BAR_FILLED_COLOR);
  console.drawString(0, 40, `HP: ${value}/${max}`, BAR_TEXT_COLOR);
}

export function renderNames(console: Console, gameMap: GameMap, x: number, y: number): void {
  console.drawString(
    21,
    39,
    capitalize(
      gameMap.entities
        .filter((e) => e.x === x && e.y === y)
        .map((e) => e.name)
        .join(', ')
    ),
    WHITE
  );
}

export function removeFromArray<T>(array: T[], element: T): void {
  const index = array.indexOf(element);
  if (index >= 0) {
    array.splice(index, 1);
  }
}
