const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const Hirer  = require('../models/Hirer');
const Job    = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email helper
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({ from: `RozgarConnect <${process.env.EMAIL_USER}>`, to, subject, html });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

/* ── ADMIN STATS ──  GET /api/admin/stats */
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [totalWorkers, totalHirers, totalJobs, pendingVerifications] = await Promise.all([
      Worker.countDocuments(),
      Hirer.countDocuments(),
      Job.countDocuments(),
      Hirer.countDocuments({ hirerType: 'business', verificationStatus: 'pending' }),
    ]);
    res.json({ success: true, stats: { totalWorkers, totalHirers, totalJobs, pendingVerifications } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET all workers ──  GET /api/admin/workers */
router.get('/workers', protect, authorize('admin'), async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { currentCity: { $regex: search, $options: 'i' } },
    ];
    const workers = await Worker.find(query).select('-password').skip((page-1)*limit).limit(Number(limit));
    const total = await Worker.countDocuments(query);
    res.json({ success: true, total, workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET pending business verifications ──  GET /api/admin/verifications */
router.get('/verifications', protect, authorize('admin'), async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const businesses = await Hirer.find({ hirerType: 'business', verificationStatus: status }).select('-password');
    res.json({ success: true, businesses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── APPROVE business ──  PUT /api/admin/verifications/:id/approve */
router.put('/verifications/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const hirer = await Hirer.findByIdAndUpdate(
      req.params.id,
      { isAdminVerified: true, verificationStatus: 'approved', verifiedAt: new Date() },
      { new: true }
    );
    if (!hirer) return res.status(404).json({ success: false, message: 'Business not found.' });

    // Send approval email
    await sendEmail(
      hirer.email,
      '✅ RozgarConnect — Business Account Approved!',
      `<h2>Congratulations ${hirer.ownerName}!</h2>
       <p>Your business account <strong>${hirer.companyName}</strong> has been verified and approved.</p>
       <p>You can now login and post bulk job requirements on RozgarConnect.</p>
       <p>— Team RozgarConnect</p>`
    );

    res.json({ success: true, message: `Business "${hirer.companyName}" approved and email sent.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── REJECT business ──  PUT /api/admin/verifications/:id/reject */
router.put('/verifications/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    const hirer = await Hirer.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: 'rejected', rejectionReason: reason },
      { new: true }
    );
    if (!hirer) return res.status(404).json({ success: false, message: 'Business not found.' });

    // Send rejection email
    await sendEmail(
      hirer.email,
      '❌ RozgarConnect — Business Verification Update',
      `<h2>Dear ${hirer.ownerName},</h2>
       <p>We were unable to verify your business account <strong>${hirer.companyName}</strong>.</p>
       <p><strong>Reason:</strong> ${reason}</p>
       <p>Please re-submit with correct documents. Contact support@rozgarconnect.in for help.</p>
       <p>— Team RozgarConnect</p>`
    );

    res.json({ success: true, message: 'Business rejected and email sent.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET all jobs ──  GET /api/admin/jobs */
router.get('/jobs', protect, authorize('admin'), async (req, res) => {
  try {
    const jobs = await Job.find().populate('hirer', 'name companyName email').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── SUSPEND worker ──  PUT /api/admin/workers/:id/suspend */
router.put('/workers/:id/suspend', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
    res.json({ success: true, message: `Worker ${worker.firstName} suspended.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── DELETE job post ──  DELETE /api/admin/jobs/:id */
router.delete('/jobs/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
