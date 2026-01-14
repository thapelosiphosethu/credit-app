const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = "secretkey"; // Change this for production

// -------------------- LEAD FORM --------------------
app.post('/lead', (req, res) => {
  const { fullname, phone, income, debt } = req.body;

  let status = "Good";
  if (parseInt(debt) > parseInt(income)) status = "High Debt";
  if (parseInt(income) < 8000) status = "Low Income";

  db.run(
    `INSERT INTO leads (fullname, phone, income, debt, status) VALUES (?, ?, ?, ?, ?)`,
    [fullname, phone, income, debt, status],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Lead submitted", status });
    }
  );
});

// -------------------- STAFF REGISTER --------------------
app.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  db.run(
    `INSERT INTO staff (email, password) VALUES (?, ?)`,
    [req.body.email, hashed],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Staff created" });
    }
  );
});

// -------------------- STAFF LOGIN --------------------
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM staff WHERE email = ?`, [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid login" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid login" });

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
  });
});

// -------------------- CLOCK-IN --------------------
app.post('/clockin', (req, res) => {
  db.run(
    `INSERT INTO clocking (staff_id, clock_in) VALUES (?, datetime('now'))`,
    [req.body.staff_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Clocked in" });
    }
  );
});

// -------------------- CLOCK-OUT --------------------
app.post('/clockout', (req, res) => {
  db.run(
    `UPDATE clocking SET clock_out = datetime('now') WHERE staff_id = ? AND clock_out IS NULL`,
    [req.body.staff_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Clocked out" });
    }
  );
});

// -------------------- VIEW LEADS --------------------
app.get('/leads', (req, res) => {
  db.all(`SELECT * FROM leads ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// -------------------- VIEW CLOCKING --------------------
app.get('/attendance', (req, res) => {
  db.all(`SELECT * FROM clocking`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
