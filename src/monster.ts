import { Actor, BasicMonster, Sprite, Game } from 'wglt';
import { Fighter } from './fighter';
import { Player } from './player';

export class Monster extends Fighter {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite);
    this.ai = new BasicMonster(this, this.calculateDamage);
  }

  onBump(player: Player) {
    player.attack(this, this.calculateDamage(player, this));
    return true;
  }

  onDeath(attacker: Fighter) {
    this.game.log(this.name + ' is dead');
    this.game.entities.remove(this);
  }

  private calculateDamage(attacker: Actor, target: Actor) {
    return (attacker as Fighter).power - (target as Fighter).defense;
  }
}
