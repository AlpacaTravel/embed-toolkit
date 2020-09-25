import { EventEmitter2, Listener } from "eventemitter2";

class Evented {
  private emitter: EventEmitter2;

  constructor() {
    // Set up event handling
    this.emitter = new EventEmitter2();

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.once = this.once.bind(this);
    this.emit = this.emit.bind(this);
  }

  // Event handling
  on(event: string, listener: Listener) {
    this.emitter.on(event, listener);
  }
  off(event: string, listener: Listener) {
    this.emitter.off(event, listener);
  }
  once(event: string, listener: Listener) {
    this.emitter.once(event, listener);
  }
  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args);
  }
}

export default Evented;
