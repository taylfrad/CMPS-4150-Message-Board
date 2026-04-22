// Subject — part of the Observer design pattern (GoF).
// Maintains a list of Observers and notifies them when something
// worth observing happens. Concrete subjects subclass this and call
// `this.notify(event)` at the right moment (see TopicSubject).
class Subject {
  constructor() {
    this._observers = [];
  }

  attach(observer) {
    if (!this._observers.includes(observer)) {
      this._observers.push(observer);
    }
  }

  detach(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }

  async notify(event) {
    // Run observers sequentially so one slow observer can't race another.
    for (const observer of this._observers) {
      await observer.update(this, event);
    }
  }
}

module.exports = Subject;
