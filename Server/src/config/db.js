import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('CRITICAL: DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  max: 20, // Max connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event listener for idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

// Run Migration script on pool initialization
const runMigration = async () => {
  try {
    const migrationPath = path.resolve('sql/14_auth_migration.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('Database start: Checking and applying auth migration...');
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(sql);
      console.log('Database start: Auth migration successfully checked/applied.');
    }
  } catch (err) {
    console.error('Database start: Failed to run auth migration:', err.message);
  }
};
runMigration();

export default {
  query: (text, params) => pool.query(text, params),
  getPool: () => pool,
};
