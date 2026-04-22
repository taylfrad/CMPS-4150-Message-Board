// Observer — part of the Observer design pattern (GoF).
// Abstract base. Subclasses override `update(subject, event)` to react
// to events emitted by Subjects they are attached to.
class Observer {
  // eslint-disable-next-line no-unused-vars
  async update(subject, event) {
    throw new Error('Observer.update is abstract — subclasses must implement it.');
  }
}

module.exports = Observer;
