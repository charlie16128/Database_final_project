import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'server', 'db', 'database.sqlite')
const db = new Database(dbPath)

try {
  const users = db.prepare('SELECT id, username, email, password_hash FROM users').all()
  console.log('--- Users List ---')
  users.forEach(u => {
    console.log(`ID: ${u.id}, User: ${u.username}, Email: ${u.email}, HashLength: ${u.password_hash?.length}`)
    if (u.password_hash) {
        console.log(`Hash starts with: ${u.password_hash.substring(0, 7)}`)
    }
  })
} catch (err) {
  console.error(err)
} finally {
  db.close()
}
