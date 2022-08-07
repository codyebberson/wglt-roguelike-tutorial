import { Key, serializable, Terminal } from 'wglt';
import { Action, BumpAction, PickupAction, TakeStairsAction } from './actions';
import { BaseComponent } from './base';
import { Colors } from './color';

export abstract class EventHandler extends BaseComponent {
  abstract handleEvents(term: Terminal): void;

  onRender(_term: Terminal): void {
    // By default, do nothing
    // Override in subclasses
  }
}

@serializable
export class MainGameEventHandler extends EventHandler {
  handleEvents(term: Terminal): void {
    const moveKey = term.getMovementKey();
    let action: Action | undefined = undefined;

    if (term.isKeyDown(Key.VK_SHIFT_LEFT) && term.isKeyPressed(Key.VK_PERIOD)) {
      action = new TakeStairsAction(this.engine.player);
    } else if (moveKey) {
      action = new BumpAction(this.engine.player, moveKey.x, moveKey.y);
    } else if (term.isKeyPressed(Key.VK_G)) {
      action = new PickupAction(this.engine.player);
    } else if (term.isKeyPressed(Key.VK_SLASH)) {
      this.engine.eventHandler = new LookHandler(this.engine);
    }

    if (action) {
      this.engine.handleAction(action);
    }
  }
}

export abstract class TargetingHandler extends EventHandler {
  x: number;
  y: number;

  constructor(parent: BaseComponent) {
    super(parent);
    this.x = parent.engine.player.x;
    this.y = parent.engine.player.y;
  }

  handleEvents(term: Terminal): void {
    const moveKey = term.getMovementKey();
    if (moveKey) {
      this.x += moveKey.x;
      this.y += moveKey.y;
    } else if (term.isKeyPressed(Key.VK_ENTER) || term.isKeyPressed(Key.VK_NUMPAD_ENTER)) {
      this.onSelect(this.x, this.y);
    } else if (term.isKeyPressed(Key.VK_ESCAPE)) {
      this.engine.eventHandler = new MainGameEventHandler(this.engine);
    }
  }

  onRender(term: Terminal): void {
    term.drawChar(this.x, this.y, 0, Colors.WHITE, Colors.WHITE);
  }

  abstract onSelect(x: number, y: number): void;
}

@serializable
export class LookHandler extends TargetingHandler {
  onSelect(): void {
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}

@serializable
export class SingleRangedAttackHandler extends TargetingHandler {
  constructor(readonly action: Action) {
    super(action);
  }

  onSelect(x: number, y: number): void {
    this.action.target = { x, y };
    this.engine.handleAction(this.action);
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}

@serializable
export class AreaRangedAttackHandler extends TargetingHandler {
  constructor(readonly radius: number, readonly action: Action) {
    super(action);
  }

  onRender(term: Terminal): void {
    term.drawSingleBox(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2 + 1,
      this.radius * 2 + 1,
      Colors.RED
    );
  }

  onSelect(x: number, y: number): void {
    this.action.target = { x, y };
    this.engine.handleAction(this.action);
    this.engine.eventHandler = new MainGameEventHandler(this.engine);
  }
}
