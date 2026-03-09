export type ControllerKey = 'u' | 'd' | 'b' | 'f' | '1' | '2' | '3' | '4';

export interface IController {
  keySet: Set<ControllerKey>;
  updateState?: () => void;
  init?: () => void;
  terminate?: () => void;
}

export type KeyboardControllerKeyMap = Record<string, ControllerKey[]>;

export type KeyboardControllerConfig = {
  keyMap: KeyboardControllerKeyMap;
};

export type GamepadControllerConfig = {
  gamepadIndex: number;
  buttonsMap: Record<number, ControllerKey[]>;
  axisIndex: number;
  axisMappings: { from: number; to: number; keys: ControllerKey[] }[];
};
