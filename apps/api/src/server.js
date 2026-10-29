import { app } from './app.js';
import { env } from './config/env.js';

// Only start the server if not running under Passenger (cPanel)
// Passenger manages the port and process lifecycle
const isPassenger = process.env.PASSENGER_APP_ROOT || process.env.PASSENGER_SPAWN_DIR;

if (!isPassenger) {
  app.listen(env.port, () => console.log(`Relief Nepal API listening on port ${env.port}`));
} else {
  console.log('Running under Phusion Passenger (cPanel)');
}
