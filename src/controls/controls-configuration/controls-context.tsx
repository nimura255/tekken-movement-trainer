import {
  createContext,
  useContext,
} from 'react';
import {
  type GamepadControllerConfig,
  type KeyboardControllerConfig,
} from '$/controls/controller-api';
import type { ControlsConfig } from './types';

export type ControlsContextValue = ControlsConfig & {
  setGamepadConfig: (config: GamepadControllerConfig) => void;
  setKeyboardConfig: (config: KeyboardControllerConfig) => void;
};

export const ControlsContext = createContext<ControlsContextValue | null>(null);

export function useControlsConfigurationContext() {
  const contextValue = useContext(ControlsContext);

  if (!contextValue) {
    throw new Error('useControlsContext can only be used inside ControlsContextProvider')
  }

  return contextValue;
}
