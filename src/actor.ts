import { capitalize, Color, fromRgb, serializable } from 'wglt';
import { BaseAI } from './ai';
import { ENEMY_DIE_COLOR, PLAYER_DIE_COLOR } from './color';
import { Engine } from './engine';
import { Entity, RenderOrder } from './entity';
import { Item } from './item';
import { openLevelUpMenu } from './main';

@serializable
export class Actor extends Entity {
  readonly inventory: Item[] = [];
  level = 1;

  constructor(
    char: string,
    color: Color,
    name: string,
    blocks: boolean,
    public maxHp: number,
    private hp_: number,
    public defense: number,
    public power: number,
    public xp = 0,
    public ai?: BaseAI
  ) {
    super(0, 0, char, color, name, blocks);
    this.renderOrder = RenderOrder.ACTOR;
  }

  get hp(): number {
    return this.hp_;
  }

  get experienceToNextLevel(): number {
    return this.level * 50;
  }

  addXp(engine: Engine, amount: number): void {
    this.xp += amount;
    engine.log(`You gain ${amount} experience points.`);

    if (this.xp >= this.experienceToNextLevel) {
      openLevelUpMenu(engine);
    }
  }

  levelUp(): void {
    this.xp -= this.experienceToNextLevel;
    this.level++;
  }

  increaseMaxHp(engine: Engine, amount = 20): void {
    this.maxHp += amount;
    this.hp_ += amount;
    engine.log('Your health improves!');
    this.levelUp();
  }

  increasePower(engine: Engine, amount = 1): void {
    this.power += amount;
    engine.log('You feel stronger!');
    this.levelUp();
  }

  increaseDefense(engine: Engine, amount = 1): void {
    this.defense += amount;
    engine.log('Your movements are swifter!');
    this.levelUp();
  }

  heal(_engine: Engine, amount: number): number {
    const actualHealAmount = Math.min(amount, this.maxHp - this.hp);
    this.hp_ += actualHealAmount;
    return actualHealAmount;
  }

  takeDamage(engine: Engine, amount: number): void {
    this.hp_ = Math.max(0, Math.min(this.hp_ - amount, this.maxHp));
    if (this.hp_ === 0) {
      this.die(engine);
    }
  }

  die(engine: Engine): void {
    if (this === engine.player) {
      engine.log('You died!', PLAYER_DIE_COLOR);
    } else {
      engine.log(`${capitalize(this.name)} is dead!`, ENEMY_DIE_COLOR);
      engine.player.addXp(engine, this.xp);
    }

    this.char = '%';
    this.color = fromRgb(191, 0, 0);
    this.blocks = false;
    this.ai = undefined;
    this.name = 'remains of ' + this.name;
    this.renderOrder = RenderOrder.CORPSE;
  }
}
