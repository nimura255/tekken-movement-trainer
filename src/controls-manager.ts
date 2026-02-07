import {MovementManager, type MoveKey} from '$/movement-manager';
import {RequestAnimationFrameLoop} from './request-animation-frame-loop';
import {KeyboardManager} from '$/keyboard-manager';

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
    ]);

    this.keyboardManager.keysSet.forEach(keyboardKey => {
      const adaptedMoveKey = adaptKeyCodeToKeysMapKey(keyboardKey);

      if (adaptedMoveKey) {
        buttonsMap.set(adaptedMoveKey, true);
      }
    });

    const gamepads = navigator.getGamepads();

    const movementAxis = gamepads[0]?.axes[9];

    if (movementAxis) {
      const gamepadTranslatedDirectionButtons = gamepadAxisToKeys(movementAxis);

      gamepadTranslatedDirectionButtons?.map(key => {
        buttonsMap.set(key, true);
      });
    }

    buttonsMap.forEach((isKeyDown, moveKey) => {
      if (isKeyDown) {
        this.movementManager.keyDown(moveKey)
      } else {
        this.movementManager.keyUp(moveKey)
      }
    });
  }

  private gameLoop = new RequestAnimationFrameLoop(this.loopStep);
}

function gamepadAxisToKeys(value: number): MoveKey[] | undefined {
  if (value > -1.1 && value < -0.9) {
    return ['up']
  }

  if (value > -0.8 && value < -0.6) {
    return ['up', 'right'];
  }

  if (value > -0.5 && value < -0.4) {
    return ['right'];
  }

  if (value > -0.2 && value < -0.1) {
    return ['down', 'right'];
  }

  if (value > 0.1 && value < 0.2) {
    return ['down'];
  }

  if (value > 0.4 && value < 0.5) {
    return ['down', 'left'];
  }

  if (value > 0.7 && value < 0.8) {
    return ['left'];
  }

  if (value > 0.9 && value < 1.1) {
    return ['up', 'left'];
  }
}

function adaptKeyCodeToKeysMapKey(keyCode: string): MoveKey | undefined {
  switch (keyCode) {
    case 'ArrowUp':
    case 'KeyW':
      return 'up';
    case 'ArrowDown':
    case 'KeyS':
      return 'down';
    case 'ArrowLeft':
    case 'KeyA':
      return 'left';
    case 'ArrowRight':
    case 'KeyD':
      return 'right';
    default:
      return undefined;
  }
}
