
import {EventEmitter} from '$/event-emitter';

export type KeysMapKey = 'up' | 'down' | 'left' | 'right' | '1' | '2' | '3' | '4';

export type InputEventPayload = Record<KeysMapKey, boolean>;
type InputListener = (payload: InputEventPayload) => void;

export class InputsManager {
  private keysMap = {
    down: false,
    left: false,
    right: false,
    up: false,
    1: false,
    2: false,
    3: false,
    4: false,
  }
  private eventEmitter = new EventEmitter<Record<KeysMapKey, boolean>>();

  public changeKeys(newKeysMap: Record<KeysMapKey, boolean>) {
    let hasMapChanged = false;

    for (const key in this.keysMap) {
      if (this.keysMap[key as KeysMapKey] != newKeysMap[key as KeysMapKey]) {
        hasMapChanged = true;
        break;
      }
    }

    this.keysMap = newKeysMap;

    if (hasMapChanged) {
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
