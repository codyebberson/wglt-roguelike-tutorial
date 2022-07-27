import { Key, Terminal } from 'wglt';
import { Action, BumpAction, PickupAction } from './actions';
import { Engine } from './engine';

export abstract class EventHandler {
  constructor(readonly engine: Engine) {}

  abstract handleEvents(term: Terminal): void;
}

export class MainGameEventHandler extends EventHandler {
  handleEvents(term: Terminal): void {
    let action: Action | undefined = undefined;

    const moveKey = term.getMovementKey();
    if (moveKey) {
      action = new BumpAction(this.engine.player, moveKey.x, moveKey.y);
    } else if (term.isKeyPressed(Key.VK_G)) {
      action = new PickupAction(this.engine.player);
    }

    if (action) {
      this.engine.handleAction(action);
    }
  }
}
