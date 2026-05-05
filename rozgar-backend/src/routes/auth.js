const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const Hirer  = require('../models/Hirer');

// Helper: generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Helper: send token response
const sendToken = (user, statusCode, res, role) => {
  const token = generateToken(user._id, role);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:   user._id,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : user.name,
      role,
      ...(role === 'hirer' && { hirerType: user.hirerType }),
    },
  });
};

/* ──────────────────────────────────────────────
   WORKER REGISTER  POST /api/auth/worker/register
────────────────────────────────────────────── */
router.post('/worker/register', async (req, res) => {
  try {
    const { firstName, lastName, mobile, age, gender, skills, currentCity, preferredCities, password } = req.body;

    // Check if mobile already exists
    const exists = await Worker.findOne({ mobile });
    if (exists) return res.status(400).json({ success: false, message: 'Mobile number already registered.' });

    const worker = await Worker.create({
      firstName, lastName, mobile, age, gender,
      skills, currentCity, preferredCities, password,
    });

    sendToken(worker, 201, res, 'worker');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ──────────────────────────────────────────────
   WORKER LOGIN  POST /api/auth/worker/login
────────────────────────────────────────────── */
router.post('/worker/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password)
      return res.status(400).json({ success: false, message: 'Please provide mobile and password.' });

    const worker = await Worker.findOne({ mobile }).select('+password');
    if (!worker || !(await worker.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid mobile or password.' });

    sendToken(worker, 200, res, 'worker');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ──────────────────────────────────────────────
   REGULAR HIRER REGISTER  POST /api/auth/hirer/register
────────────────────────────────────────────── */
router.post('/hirer/register', async (req, res) => {
  try {
    const { name, mobile, email, password, city, address } = req.body;

    const exists = await Hirer.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const hirer = await Hirer.create({
      name, mobile, email, password, city, address,
      hirerType: 'regular',
      isOtpVerified: true, // mock: auto-verified for now
    });

    sendToken(hirer, 201, res, 'hirer');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ──────────────────────────────────────────────
   BUSINESS REGISTER  POST /api/auth/business/register
────────────────────────────────────────────── */
router.post('/business/register', async (req, res) => {
  try {
    const { companyName, businessType, city, address, yearsInBusiness, ownerName, mobile, mobile2, email, gstNumber, password } = req.body;

    const exists = await Hirer.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const hirer = await Hirer.create({
      name: ownerName,
      companyName, businessType, city, address,
      yearsInBusiness, ownerName, mobile, mobile2,
      email, gstNumber, password,
      hirerType: 'business',
      verificationStatus: 'pending', // goes to admin queue
    });

    res.status(201).json({
      success: true,
      message: 'Business account submitted! Admin will verify in 24-48 hours. You will receive an email.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ──────────────────────────────────────────────
   HIRER LOGIN  POST /api/auth/hirer/login
────────────────────────────────────────────── */
router.post('/hirer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });

    const hirer = await Hirer.findOne({ email }).select('+password');
    if (!hirer || !(await hirer.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Business accounts must be approved
   // if (hirer.hirerType === 'business' && !hirer.isAdminnpVerified)
     // return res.status(403).json({ success: false, message: 'Your business account is pending admin verification.' });

    sendToken(hirer, 200, res, 'hirer');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ──────────────────────────────────────────────
   ADMIN LOGIN  POST /api/auth/admin/login
────────────────────────────────────────────── */
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@rozgarconnect.in' && password === 'admin123') {
    const token = generateToken('admin', 'admin');
    return res.json({ success: true, token, user: { id: 'admin', name: 'Admin', role: 'admin' } });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
});

/* ──────────────────────────────────────────────
   MOCK OTP SEND  POST /api/auth/send-otp
   (For prototype — always succeeds)
────────────────────────────────────────────── */
router.post('/send-otp', (req, res) => {
  const { mobile } = req.body;
  console.log(`📱 OTP sent to ${mobile}: 123456 (mock)`);
  res.json({ success: true, message: 'OTP sent successfully.', otp: '123456' }); // remove otp in production
});

/* ──────────────────────────────────────────────
   MOCK OTP VERIFY  POST /api/auth/verify-otp
────────────────────────────────────────────── */
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === '123456') {
    return res.json({ success: true, message: 'OTP verified.' });
  }
  res.status(400).json({ success: false, message: 'Invalid OTP.' });
});

module.exports = router;
