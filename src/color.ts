import { fromRgb } from 'wglt';

export const WHITE = fromRgb(0xff, 0xff, 0xff);
export const BLACK = fromRgb(0x0, 0x0, 0x0);
export const RED = fromRgb(0xff, 0x0, 0x0);

export const PLAYER_ATTACK_COLOR = fromRgb(0xe0, 0xe0, 0xe0);
export const ENEMY_ATTACK_COLOR = fromRgb(0xff, 0xc0, 0xc0);
export const NEEDS_TARGET_COLOR = fromRgb(0x3f, 0xff, 0xff);
export const STATUS_EFFECT_APPLIED_COLOR = fromRgb(0x3f, 0xff, 0x3f);

export const PLAYER_DIE_COLOR = fromRgb(0xff, 0x30, 0x30);
export const ENEMY_DIE_COLOR = fromRgb(0xff, 0xa0, 0x30);

export const INVALID_COLOR = fromRgb(0xff, 0xff, 0x00);
export const IMPOSSIBLE_COLOR = fromRgb(0x80, 0x80, 0x80);
export const ERROR_COLOR = fromRgb(0xff, 0x40, 0x40);

export const WELCOME_TEXT_COLOR = fromRgb(0x20, 0xa0, 0xff);
export const HEALTH_RECOVERED_COLOR = fromRgb(0x0, 0xff, 0x0);

export const BAR_TEXT_COLOR = WHITE;
export const BAR_FILLED_COLOR = fromRgb(0x0, 0x60, 0x0);
export const BAR_EMPTY_COLOR = fromRgb(0x40, 0x10, 0x10);

export const MENU_TITLE_COLOR = fromRgb(255, 255, 63);
export const MENU_TEXT = WHITE;
