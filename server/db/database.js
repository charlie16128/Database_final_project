import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, 'database.sqlite')
const SCHEMA_PATH = path.join(__dirname, 'schema.sql')

// Open (or create) the database
const db = new Database(DB_PATH)

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL')
// Enforce foreign key constraints
db.pragma('foreign_keys = ON')

// Run schema if tables don't exist yet
const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
db.exec(schema)

console.log('✅ Database initialised at', DB_PATH)

export default db
