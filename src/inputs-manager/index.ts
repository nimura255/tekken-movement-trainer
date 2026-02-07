
import {EventEmitter} from '$/event-emitter';

export type KeysMapKey = 'up' | 'down' | 'left' | 'right';

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

  public inputKey(key: KeysMapKey) {
    if (!this.keysMap[key]) {
      this.keysMap[key] = true;
      this.eventEmitter.notify('input', {...this.keysMap});
    }
  }

  public releaseKey(key: KeysMapKey) {
    if (this.keysMap[key]) {
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
