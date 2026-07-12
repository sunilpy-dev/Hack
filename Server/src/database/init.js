import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Parse DATABASE_URL to get credentials
const getConnectionStringForDefaultDb = (connStr) => {
  try {
    const url = new URL(connStr);
    url.pathname = '/postgres'; // Connect to default postgres DB first
    return url.toString();
  } catch (err) {
    // If not a valid URL (e.g. simple connection string), try regex replacement
    return connStr.replace(/\/([^/]+)$/, '/postgres');
  }
};

const getDatabaseName = (connStr) => {
  try {
    const url = new URL(connStr);
    return url.pathname.slice(1);
  } catch (err) {
    const match = connStr.match(/\/([^/]+)$/);
    return match ? match[1] : 'assetflow';
  }
};

async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not defined in env');
    process.exit(1);
  }

  const dbName = getDatabaseName(dbUrl);
  console.log(`Target database name: ${dbName}`);

  // Step 1: Ensure database exists by connecting to 'postgres' first
  const defaultConnStr = getConnectionStringForDefaultDb(dbUrl);
  const defaultClient = new Client({ connectionString: defaultConnStr });

  try {
    await defaultClient.connect();
    const res = await defaultClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating it...`);
      // CREATE DATABASE cannot run inside a transaction block, run it directly
      await defaultClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
  } finally {
    await defaultClient.end();
  }

  // Step 2: Connect to the target database and execute scripts
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log(`Connected to database "${dbName}". Loading schemas...`);

    const sqlDir = path.resolve('sql');
    if (!fs.existsSync(sqlDir)) {
      console.error(`SQL directory not found at ${sqlDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(sqlDir)
      .filter(f => f.endsWith('.sql') && !f.includes('(1)'))
      .sort(); // Sorts them alphabetically/numerically: 00, 01, 02...

    console.log(`Found ${files.length} SQL script files to run.`);

    for (const file of files) {
      console.log(`Executing: ${file}...`);
      const filePath = path.join(sqlDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL content
      await client.query(sql);
      console.log(`Finished: ${file}`);
    }

    console.log('Database initialization completed successfully!');
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
