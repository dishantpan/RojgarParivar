const express = require('express');
const router = express.Router();
const Hirer  = require('../models/Hirer');
const Job    = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

/* ── GET hirer's own profile ──
   GET /api/hirers/me
*/
router.get('/me', protect, authorize('hirer'), async (req, res) => {
  try {
    const hirer = await Hirer.findById(req.user.id).select('-password');
    res.json({ success: true, hirer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── UPDATE hirer profile ──
   PUT /api/hirers/profile
*/
router.put('/profile', protect, authorize('hirer'), async (req, res) => {
  try {
    const { name, city, address, mobile, mobile2, bio } = req.body;
    const hirer = await Hirer.findByIdAndUpdate(
      req.user.id,
      { name, city, address, mobile, mobile2 },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, hirer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET hirer's job posts ──
   GET /api/hirers/jobs
*/
router.get('/jobs', protect, authorize('hirer'), async (req, res) => {
  try {
    const jobs = await Job.find({ hirer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET applicants for a specific job ──
   GET /api/hirers/jobs/:jobId/applicants
*/
router.get('/jobs/:jobId/applicants', protect, authorize('hirer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applications.worker', '-password');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.hirer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not your job.' });

    res.json({ success: true, applications: job.applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── CONTACT a worker (mark as contacted) ──
   PUT /api/hirers/jobs/:jobId/contact/:workerId
*/
router.put('/jobs/:jobId/contact/:workerId', protect, authorize('hirer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const app = job.applications.find(a => a.worker.toString() === req.params.workerId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

    app.status = 'contacted';
    job.status = 'in_progress';
    job.activeWorker = req.params.workerId;
    await job.save();

    res.json({ success: true, message: 'Worker marked as contacted. Job is now in progress.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
