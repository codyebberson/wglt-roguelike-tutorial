import { Color, fromRgb, serializable } from 'wglt';
import { BaseAI } from './ai';
import { Entity, RenderOrder } from './entity';
import { capitalize } from './utils';

@serializable
export class Actor extends Entity {
  constructor(
    x: number,
    y: number,
    char: string,
    color: Color,
    name: string,
    blocks: boolean,
    public maxHp: number,
    private hp_: number,
    public defense: number,
    public power: number,
    public ai?: BaseAI
  ) {
    super(x, y, char, color, name, blocks);
    this.renderOrder = RenderOrder.ACTOR;
  }

  get hp(): number {
    return this.hp_;
  }

  set hp(value: number) {
    this.hp_ = Math.max(0, Math.min(value, this.maxHp));

    if (this.hp_ === 0) {
      this.die();
    }
  }

  die(): void {
    console.log(this.name === 'player' ? 'You died' : `${capitalize(this.name)} is dead!`);
    this.char = '%';
    this.color = fromRgb(191, 0, 0);
    this.blocks = false;
    this.ai = undefined;
    this.name = 'remains of ' + this.name;
    this.renderOrder = RenderOrder.CORPSE;
  }
}
