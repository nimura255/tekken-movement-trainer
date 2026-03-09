import {
  useState,
  type ReactNode, useMemo,
} from 'react';
import {
  getConfigFromLocalStorage,
  setGamepadConfigToLocalStorage,
  setKeyboardConfigToLocalStorage,
} from './configuration-utils';
import { defaultGamepadConfig, defaultKeyboardConfig } from './constants';
import { ControlsContext, type ControlsContextValue } from './controls-context'
import type { ControlsConfig } from './types';

type ControlsContextProviderProps = {
  children: ReactNode;
};

export function ControlsConfigurationContextProvider({ children }: ControlsContextProviderProps) {
  const [config, setConfig] = useState<ControlsConfig>(getConfigFromLocalStorage() || {
    keyboardConfig: defaultKeyboardConfig,
    gamepadConfig: defaultGamepadConfig,
  });
  const contextValue = useMemo<ControlsContextValue>(() => ({
    ...config,
    setGamepadConfig: (gamepadConfig) => {
      setConfig({ ...config, gamepadConfig });
      setGamepadConfigToLocalStorage(gamepadConfig);
    },
    setKeyboardConfig: (keyboardConfig) => {
      setConfig({ ...config, keyboardConfig });
      setKeyboardConfigToLocalStorage(keyboardConfig);
    },
  }), [config]);

  return (
    <ControlsContext value={contextValue}>
      {children}
    </ControlsContext>
  );
}
