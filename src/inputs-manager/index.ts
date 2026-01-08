
import {EventEmitter} from '$/event-emitter';

type KeysMapKey = 'up' | 'down' | 'left' | 'right';

export type InputEventPayload = Record<KeysMapKey, boolean>;
type InputListener = (payload: InputEventPayload) => void;

export class InputsManager {
  private keysMap = {
    down: false,
    left: false,
    right: false,
    up: false,
  }
  private eventEmitter = new EventEmitter<Record<KeysMapKey, boolean>>();

  public inputKey(keyCode: string) {
    const key = adaptKeyCodeToKeysMapKey(keyCode);

    if (key && !this.keysMap[key]) {
      this.keysMap[key] = true;
      this.eventEmitter.notify('input', {...this.keysMap});
    }
  }

  public releaseKey(keyCode: string) {
    const key = adaptKeyCodeToKeysMapKey(keyCode);

    if (key && this.keysMap[key]) {
      this.keysMap[key] = false;
      this.eventEmitter.notify('input', {...this.keysMap});
    }
  }

  public subscribeToInputs(listener: InputListener) {
    this.eventEmitter.subscribe('input', listener);
  }

  public unsubscribeFromInputs(listener: InputListener) {
    this.eventEmitter.unsubscribe('input', listener);
  }
}

function adaptKeyCodeToKeysMapKey(keyCode: string): KeysMapKey | undefined {
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
