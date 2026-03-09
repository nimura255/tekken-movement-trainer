import type {
  ControllerKey,
  IController,
  KeyboardControllerConfig,
  KeyboardControllerKeyMap,
} from './types';

export class KeyboardController implements IController {
  public keySet = new Set<ControllerKey>();
  private keyMap: KeyboardControllerKeyMap;

  constructor(config: KeyboardControllerConfig) {
    this.keyMap = config.keyMap;
  }

  public updateState() {}

  public init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  public terminate() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyMap[event.code].forEach(key => this.keySet.add(key));
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyMap[event.code].forEach(key => this.keySet.delete(key));
  }
}
