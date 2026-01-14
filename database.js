const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./leads.db');

db.serialize(() => {
  // Leads table
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT,
    phone TEXT,
    income TEXT,
    debt TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Staff table
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  // Clocking table
  db.run(`CREATE TABLE IF NOT EXISTS clocking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER,
    clock_in DATETIME,
    clock_out DATETIME
  )`);
});

module.exports = db;
