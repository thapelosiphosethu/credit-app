const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const db = require('./database'); // COMMENTED OUT for now

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = "secretkey";

/* LEAD FORM */
app.post('/lead', (req, res) => {
  const { fullname, phone, income, debt } = req.body;

  console.log('New lead:', { fullname, phone, income, debt });

  let status = "Good";
  if (parseInt(debt) > parseInt(income)) status = "High Debt";
  if (parseInt(income) < 8000) status = "Low Income";

  res.json({ message: "Lead submitted", status });
});

/* STAFF REGISTER (ONE TIME) */
app.post('/register', async (req, res) => {
  console.log('Staff registration:', req.body);
  res.json({ message: "Staff created (simulation)" });
});

/* STAFF LOGIN */
app.post('/login', async (req, res) => {
  console.log('Staff login attempt:', req.body);
  res.json({ token: "FAKE-JWT-TOKEN" });
});

/* CLOCK IN */
app.post('/clockin', (req, res) => {
  console.log('Clock in:', req.body);
  res.json({ message: "Clocked in (simulated)" });
});

/* CLOCK OUT */
app.post('/clockout', (req, res) => {
  console.log('Clock out:', req.body);
  res.json({ message: "Clocked out (simulated)" });
});

/* VIEW LEADS */
app.get('/leads', (req, res) => {
  console.log('Fetch leads request');
  res.json([{ fullname: "Test Lead", phone: "072...", income: "5000", debt: "10000", status: "High Debt" }]);
});

/* VIEW CLOCKING */
app.get('/attendance', (req, res) => {
  console.log('Fetch attendance request');
  res.json([{ staff_id: 1, clock_in: "2026-01-14 08:00", clock_out: "2026-01-14 17:00" }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
