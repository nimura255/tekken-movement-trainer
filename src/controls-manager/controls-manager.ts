import {MovementManager, type MoveKey} from '$/movement-manager';
import {KeyboardManager} from '$/keyboard-manager';
import {RequestAnimationFrameLoop} from './request-animation-frame-loop';
import {
  adaptKeyCodeToKeysMapKey,
  gamepadAxisToKeys,
  gamepadButtonsToKeys,
} from './helpers';

export class ControlsManager {
  private movementManager: MovementManager;
  private keyboardManager = new KeyboardManager();

  constructor(params: {movementManager: MovementManager}) {
    this.movementManager = params.movementManager;
  }

  public init() {
    this.keyboardManager.init();
    this.gameLoop.start();
  }

  public terminate() {
    this.gameLoop.stop();
    this.keyboardManager.terminate();
  }

  private loopStep = () => {
    const buttonsMap = new Map<MoveKey, boolean> ([
      ['up', false],
      ['down', false],
      ['left', false],
      ['right', false],
      ['1', false],
      ['2', false],
      ['3', false],
      ['4', false],
    ]);

    this.keyboardManager.keysSet.forEach(keyboardKey => {
      const adaptedMoveKey = adaptKeyCodeToKeysMapKey(keyboardKey);

      if (adaptedMoveKey) {
        buttonsMap.set(adaptedMoveKey, true);
      }
    });

    const gamepads = navigator.getGamepads();

    if (gamepads[0]) {
      const keys = gamepadButtonsToKeys(gamepads[0]);

      keys.forEach((key) => {
        buttonsMap.set(key, true);
      });
    }

    const movementAxis = gamepads[0]?.axes[9];

    if (movementAxis) {
      const gamepadTranslatedDirectionButtons = gamepadAxisToKeys(movementAxis);

      gamepadTranslatedDirectionButtons?.forEach(key => {
        buttonsMap.set(key, true);
      });
    }

    this.movementManager.changeKeys(Object.fromEntries(buttonsMap) as Record<MoveKey, boolean>);
  }

  private gameLoop = new RequestAnimationFrameLoop(this.loopStep);
}


