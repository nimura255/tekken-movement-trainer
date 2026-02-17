import type {MoveKey} from '$/movement-manager';

export function gamepadAxisToKeys(value: number): MoveKey[] | undefined {
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

export function gamepadButtonsToKeys(gamepad: Gamepad): MoveKey[] {
  const result: MoveKey[] = [];

  if (gamepad.buttons[0].pressed) {
    result.push('1')
  }

  if (gamepad.buttons[3].pressed) {
    result.push('2')
  }

  if (gamepad.buttons[1].pressed) {
    result.push('3')
  }

  if (gamepad.buttons[2].pressed) {
    result.push('4')
  }

  return result;
}

export function adaptKeyCodeToKeysMapKey(keyCode: string): MoveKey | undefined {
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
    case 'KeyJ':
      return '1';
    case 'KeyI':
      return '2';
    case 'KeyK':
      return '3';
    case 'KeyO':
      return '4';
    default:
      return undefined;
  }
}
