const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    phone TEXT,
    income TEXT,
    debt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clocking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER,
    clock_in TEXT,
    clock_out TEXT
  )`);
});

module.exports = db;
