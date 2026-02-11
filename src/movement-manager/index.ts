
import {EventEmitter} from '$/event-emitter';
import {InputsManager, type InputEventPayload, type KeysMapKey} from '$/inputs-manager';
import type {DirectionInput} from '$/types';

type MovementListener = (move: DirectionInput) => void;

export type MoveKey = KeysMapKey;

export class MovementManager {
  private inputsManager = new InputsManager();
  private eventEmitter = new EventEmitter<DirectionInput>();

  public init() {
    this.inputsManager.subscribeToInputs(this.handleInputChange);
  }

  public terminate() {
    this.inputsManager.unsubscribeFromInputs(this.handleInputChange);
  }

  public subscribeToMove(listener: MovementListener) {
    this.eventEmitter.subscribe('move', listener);
  }

  public unsubscribeFromMove(listener: MovementListener) {
    this.eventEmitter.unsubscribe('move', listener);
  }

  public changeKeys = (newKeysMap: Record<KeysMapKey, boolean>) => {
    this.inputsManager.changeKeys(newKeysMap);
  };

  private handleInputChange = (payload: InputEventPayload) => {
    this.eventEmitter.notify('move', translateInputEventPayloadToCommand(payload));
  }
}

function translateInputEventPayloadToCommand(payload: InputEventPayload): DirectionInput {
  let horizontal: 'b' | 'f' | '' = '';
  let vertical: 'd' | 'u' | '' = '';

  if (payload.left && !payload.right) {
    horizontal = 'b';
  } else if (!payload.left && payload.right) {
    horizontal = 'f';
  }

  if (payload.down && !payload.up) {
    vertical = 'd';
  } else if (!payload.down && payload.up) {
    vertical = 'u';
  }

  return ((vertical + horizontal) || 'n') as DirectionInput;
}
