type ListenerCB<T> = (payload: T) => void;

export class EventEmitter<T> {
  private listeners: Map<string, Set<ListenerCB<T>>> = new Map();

  public subscribe(key: string, listener: ListenerCB<T>) {
    const listenersSet = this.listeners.get(key) || new Set();
    listenersSet.add(listener);
    this.listeners.set(key, listenersSet);
  }

  public unsubscribe(key: string, listener: ListenerCB<T>) {
    const listenersSet = this.listeners.get(key);

    if (listenersSet) {
      listenersSet.delete(listener);
    }
  }

  public notify(key: string, payload: T) {
    const listenersSet = this.listeners.get(key);

    listenersSet?.forEach(listener => {
      listener(payload);
    });
  }
}
