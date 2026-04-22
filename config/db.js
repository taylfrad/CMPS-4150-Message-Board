const mongoose = require('mongoose');

// Singleton pattern: guarantees a single DatabaseConnection instance for the
// whole process. Callers use DatabaseConnection.getInstance().connect(); calling
// `new DatabaseConnection()` a second time throws.
class DatabaseConnection {
  static #instance = null;

  constructor() {
    if (DatabaseConnection.#instance) {
      throw new Error(
        'DatabaseConnection is a Singleton — use DatabaseConnection.getInstance().'
      );
    }
    DatabaseConnection.#instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.#instance) {
      new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }

  async connect(uri = process.env.MONGODB_URI) {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    if (!uri) throw new Error('MONGODB_URI is not set');
    await mongoose.connect(uri);
    console.log('mongo connected');
    return mongoose.connection;
  }

  get connection() {
    return mongoose.connection;
  }
}

module.exports = DatabaseConnection;
