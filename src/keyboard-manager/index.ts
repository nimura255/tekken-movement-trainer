export type KeyboardKey = 'ArrowUp' | 'KeyW' | 'ArrowDown' | 'KeyS' | 'ArrowLeft' | 'KeyA' | 'ArrowRight' | 'KeyD';

export class KeyboardManager {
  public readonly keysSet = new Set<KeyboardKey>();

  public init() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  public terminate() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }


  private handleKeyDown = (event: KeyboardEvent) => {
    this.keysSet.add(event.code as KeyboardKey)
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keysSet.delete(event.code as KeyboardKey)
  }
}
