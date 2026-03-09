import type { GamepadControllerConfig, KeyboardControllerConfig } from '$/controls/controller-api';

export type ControlsConfig = {
  gamepadConfig?: GamepadControllerConfig;
  keyboardConfig?: KeyboardControllerConfig;
};
