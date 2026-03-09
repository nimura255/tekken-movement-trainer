import {
  type KeyboardControllerConfig,
  type GamepadControllerConfig,
} from '$/controls/controller-api';
import { localStorageKeyPrefix } from '$/constants';
import type { ControlsConfig } from './types';

const localStorageControlsConfigKey = `${localStorageKeyPrefix}_controls-config`;

export function getConfigFromLocalStorage(): ControlsConfig | undefined {
  const localStorageString = localStorage.getItem(localStorageControlsConfigKey);

  if (!localStorageString) {
    return undefined;
  }

  try {
    return JSON.parse(localStorageString);
  } catch (error) {
    console.error(error);

    return undefined;
  }
}

export function setGamepadConfigToLocalStorage(gamepadConfig: GamepadControllerConfig) {
  const config = getConfigFromLocalStorage() || {};

  localStorage.setItem(localStorageControlsConfigKey, JSON.stringify({ ...config, gamepadConfig }));
}

export function setKeyboardConfigToLocalStorage(keyboardConfig: KeyboardControllerConfig) {
  const config = getConfigFromLocalStorage() || {};

  localStorage.setItem(localStorageControlsConfigKey, JSON.stringify({ ...config, keyboardConfig }));
}
