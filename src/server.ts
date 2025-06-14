import dotenv from 'dotenv';
dotenv.config();

// Enable detailed error logging
process.on('uncaughtException', (error) => {
  console.error('=== Uncaught Exception ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('=======================');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('=== Unhandled Rejection ===');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  console.error('========================');
});

// Enable source maps for better stack traces
import 'source-map-support/register.js';

import app from './app.ts';

const PORT = process.env.PORT || 5000;

// Add error handling for the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (error: Error) => {
  console.error('=== Server Start Error ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('========================');
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
