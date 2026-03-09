import type { GamepadControllerConfig, KeyboardControllerConfig } from '$/controls/controller-api';

/*
default axis index: 9
default axis mapping:

up:           -1.1 to -0.9
up, right:    -0.8 to -0.6
right:        -0.5 to -0.4
down, right:  -0.2 to -0.1
down:         0.1 to 0.2
down, left:   0.4 to 0.5
left:         0.7 to 0.8
up, left:     0.9 to 1.1
*/

export const defaultGamepadConfig: GamepadControllerConfig = {
  gamepadIndex: 0,
  buttonsMap: {
    0: ['1'],
    3: ['2'],
    1: ['3'],
    2: ['4'],
  },
  axisIndex: 9,
  axisMappings: [
    { from: -1.1, to: -0.9, keys: ['u'] },
    { from: -0.8, to: -0.6, keys: ['u', 'f'] },
    { from: -0.5, to: -0.4, keys: ['f'] },
    { from: -0.2, to: -0.1, keys: ['d', 'f'] },
    { from: 0.1, to: 0.2, keys: ['d'] },
    { from: 0.4, to: 0.5, keys: ['d', 'b'] },
    { from: 0.7, to: 0.8, keys: ['b'] },
    { from: 0.9, to: 1.1, keys: ['u', 'b'] },
  ]
};

export const defaultKeyboardConfig: KeyboardControllerConfig = {
  keyMap: {
    'ArrowUp': ['u'],
    'KeyW': ['u'],
    'ArrowDown': ['d'],
    'KeyS': ['d'],
    'ArrowLeft': ['b'],
    'KeyA': ['b'],
    'ArrowRight': ['f'],
    'KeyD': ['f'],
    'KeyJ': ['1'],
    'KeyI': ['2'],
    'KeyK': ['3'],
    'KeyO': ['4']
  }
};
