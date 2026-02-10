import pg from 'pg';
const { Pool } = pg; 
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { create_table_process } from './tables/create_table_process.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:__dirname + '/.env'}); // Load environment variables


//console.log(process.env.DB_USER)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

//Let's make sure our tables are created and ready to go
const verdict = await create_table_process(pool);
//process.exit(0);
export default pool;