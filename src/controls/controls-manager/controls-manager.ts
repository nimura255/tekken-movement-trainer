import { GamepadController, KeyboardController, type IController, type ControllerKey } from '$/controls/controller-api';
import type { ControlsConfig } from '$/controls/controls-configuration';
import { EventEmitter } from '$/event-emitter';
import { RequestAnimationFrameLoop } from '$/request-animation-frame-loop';
import type { AttackInput, AttackMoveInput } from '$/types';

type MovementListener = (move: AttackMoveInput) => void;

type KeyMap = Record<ControllerKey, boolean>;

export class ControlsManager {
  private eventEmitter = new EventEmitter<AttackMoveInput>();
  private controllers: IController[] = [];
  private gameLoop = new RequestAnimationFrameLoop(() => this.loopStep());
  private keyMap: KeyMap = {
    'u': false,
    'd': false,
    'b': false,
    'f': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
  };

  constructor(config: ControlsConfig) {
    if (config.keyboardConfig) {
      this.controllers.push(new KeyboardController(config.keyboardConfig))
    }

    if (config.gamepadConfig) {
      this.controllers.push(new GamepadController(config.gamepadConfig))
    }
  }

  public init() {
    this.controllers.forEach(entity => entity.init?.());
    this.gameLoop.start();
  }

  public terminate() {
    this.controllers.forEach(entity => entity.terminate?.());
    this.gameLoop.stop();
  }

  public subscribeToMovement(listener: MovementListener) {
    this.eventEmitter.subscribe('move', listener);
  }

  public unsubscribeFromMovement(listener: MovementListener) {
    this.eventEmitter.unsubscribe('move', listener);
  }

  private loopStep() {
    let hasMapChanged = false;
    const keySet = new Set<ControllerKey>();

    this.controllers.forEach(controller => {
      controller.updateState?.();

      controller.keySet.forEach(key => {
        keySet.add(key);
      });
    });

    for (const key in this.keyMap) {
      const isKeyPressed = keySet.has(key as ControllerKey);
      const wasThisKeyPressed = this.keyMap[key as ControllerKey];

      if (wasThisKeyPressed !== isKeyPressed) {
        hasMapChanged = true;
      }

      this.keyMap[key as ControllerKey] = isKeyPressed;
    }

    if (hasMapChanged) {
      this.eventEmitter.notify('move', translateControllerKeyMapToCommand(this.keyMap));
    }
  }
}

function translateControllerKeyMapToCommand(payload: KeyMap): AttackMoveInput {
  let horizontal: 'b' | 'f' | '' = '';
  let vertical: 'd' | 'u' | '' = '';
  let attack: AttackInput | '' = '';

  if (payload.b && !payload.f) {
    horizontal = 'b';
  } else if (!payload.b && payload.f) {
    horizontal = 'f';
  }

  if (payload.d && !payload.u) {
    vertical = 'd';
  } else if (!payload.d && payload.u) {
    vertical = 'u';
  }

  for (let i = 1; i <= 4; i++) {
    if (payload[String(i) as ControllerKey]) {
      attack = attack + String(i);
    }
  }

  return ((vertical + horizontal + attack) || 'n') as AttackMoveInput;
}
