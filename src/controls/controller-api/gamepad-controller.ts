import type { IController, ControllerKey, GamepadControllerConfig } from './types';

export class GamepadController implements IController {
  public keySet = new Set<ControllerKey>();

  private readonly axisMapList: ControllerKey[][] = Array.from({ length: 40 });
  private readonly axisIndex: number;
  private readonly buttonsMap: Record<number, ControllerKey[]>;
  private readonly gamepadIndex: number;

  constructor(config: GamepadControllerConfig) {
    this.buttonsMap = config.buttonsMap;
    this.axisIndex = config.axisIndex;
    config.axisMappings.forEach(({ from, to, keys }) => {
      const startIndex = adaptAxisPointToIndex(from);
      const endIndex = adaptAxisPointToIndex(to);

      for (let i = startIndex; i <= endIndex; i++) {
        this.axisMapList[i] = keys;
      }
    });
    this.gamepadIndex = config.gamepadIndex;
  }

  public updateState() {
    this.keySet.clear();

    const gamepad = navigator.getGamepads()[this.gamepadIndex];

    if (!gamepad) {
      return;
    }

    const keysFromButtons = this.getKeysFromButtons(gamepad);
    const keysFromAxisPoint = this.getKeysFromAxes(gamepad);

    keysFromButtons.forEach(key => this.keySet.add(key));
    keysFromAxisPoint.forEach(key => this.keySet.add(key));
  }

  private getKeysFromButtons(gamepad: Gamepad): ControllerKey[] {
    return gamepad.buttons.reduce((acc: ControllerKey[], button, index) => {
      if (this.buttonsMap[index] && button.pressed) {
        acc.push(...this.buttonsMap[index]);
      }

      return acc;
    }, []);
  }

  private getKeysFromAxes(gamepad: Gamepad): ControllerKey[] {
    const axisPoint = gamepad.axes[this.axisIndex];
    const index = adaptAxisPointToIndex(axisPoint);

    return this.axisMapList[index];
  }
}

/**
 * -2 -> 0 | -1 -> 10 | 0 -> 20 | 1 -> 30 | 2 -> 40
 */
function adaptAxisPointToIndex(point: number): number {
  const roundedValue = Number.parseFloat(point.toFixed(1));

  return Math.trunc(roundedValue * 10 + 20);
}
