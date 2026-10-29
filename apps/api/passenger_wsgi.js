// passenger_wsgi.js - Entry point for cPanel Phusion Passenger
// This file is required by cPanel to run your Node.js application

import { app } from './src/app.js';

// Export the Express app for Passenger
export default app;