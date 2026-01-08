
import {EventEmitter} from '$/event-emitter';
import {InputsManager, type InputEventPayload} from '$/inputs-manager';
import type {DirectionInput} from '$/types';

type MovementListener = (move: DirectionInput) => void;

export class MovementManager {
  private inputsManager = new InputsManager();
  private eventEmitter = new EventEmitter<DirectionInput>();

  public init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.inputsManager.subscribeToInputs(this.handleInputChange);
  }

  public terminate() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.inputsManager.unsubscribeFromInputs(this.handleInputChange);
  }

  public subscribeToMove(listener: MovementListener) {
    this.eventEmitter.subscribe('move', listener);
  }

  public unsubscribeFromMove(listener: MovementListener) {
    this.eventEmitter.unsubscribe('move', listener);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.inputsManager.inputKey(event.code);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.inputsManager.releaseKey(event.code);
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
