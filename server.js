require('dotenv').config();

const app = require('./app');
const DatabaseConnection = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await DatabaseConnection.getInstance().connect();
    app.listen(PORT, () => console.log(`up on ${PORT}`));
  } catch (err) {
    console.error('boot failed:', err.message);
    process.exit(1);
  }
})();
