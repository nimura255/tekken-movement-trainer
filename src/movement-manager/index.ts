
import {EventEmitter} from '$/event-emitter';
import {InputsManager, type InputEventPayload, type KeysMapKey} from '$/inputs-manager';
import type {AttackInput, AttackMoveInput} from '$/types';

type MovementListener = (move: AttackMoveInput) => void;

export type MoveKey = KeysMapKey;

export class MovementManager {
  private inputsManager = new InputsManager();
  private eventEmitter = new EventEmitter<AttackMoveInput>();

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

function translateInputEventPayloadToCommand(payload: InputEventPayload): AttackMoveInput {
  let horizontal: 'b' | 'f' | '' = '';
  let vertical: 'd' | 'u' | '' = '';
  let attack: AttackInput | '' = '';

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

  for (let i = 1; i <= 4; i++) {
    if (payload[String(i) as keyof InputEventPayload]) {
      attack = attack + String(i);
    }
  }

  return ((vertical + horizontal + attack) || 'n') as AttackMoveInput;
}
