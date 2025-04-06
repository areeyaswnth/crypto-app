// src/database/connection-debug.ts
import { Client } from 'pg';

async function testDatabaseConnection() {
  // Log environment variables for debugging


  const connectionConfig = {
    host: process.env.DB_HOST ,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
  };

  console.log('Connection Config:', connectionConfig);

  const client = new Client(connectionConfig);

  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Database connection successful');

    const result = await client.query('SELECT NOW()');
    console.log('Current Database Time:', result.rows[0]);

    const versionResult = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', versionResult.rows[0].version);
  } catch (error) {
    console.error('Database connection failed');
    console.error('Error Details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  } finally {
    await client.end();
  }
}

testDatabaseConnection().catch(console.error);