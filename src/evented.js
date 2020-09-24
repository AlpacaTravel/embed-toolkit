const EventEmitter2 = require("eventemitter2").EventEmitter2;

class Evented {
  constructor() {
    // Set up event handling
    this.emitter = new EventEmitter2();

    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.once = this.once.bind(this);
    this.emit = this.emit.bind(this);
  }

  // Event handling
  on(...args) {
    this.emitter.on(...args);
  }
  off(...args) {
    this.emitter.off(...args);
  }
  once(...args) {
    this.emitter.once(...args);
  }
  emit(...args) {
    this.emitter.emit(...args);
  }
}

module.exports = Evented;
