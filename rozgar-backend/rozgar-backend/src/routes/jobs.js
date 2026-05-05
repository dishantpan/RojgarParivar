const express = require('express');
const router = express.Router();
const Job    = require('../models/Job');
const Worker = require('../models/Worker');
const Rating = require('../models/Rating');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { city, skill, page = 1, limit = 10 } = req.query;
    const query = { status: 'active' };
    if (city)  query.city  = { $regex: city,  $options: 'i' };
    if (skill) query.skill = { $regex: skill, $options: 'i' };

    const jobs = await Job.find(query)
      .populate('hirer', 'name companyName city averageRating')
      .sort({ isUrgent: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET single job ──
   GET /api/jobs/:id
*/
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('hirer', 'name companyName city rating');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST new job (hirer only) ──
   POST /api/jobs
*/
router.post('/', protect, authorize('hirer'), async (req, res) => {
  try {
    const { title, skill, description, city, address, salaryMin, salaryMax, numberOfDays, deadline, isUrgent, workersNeeded, minExperience, accommodationAvail, foodAvail, isPermanent } = req.body;

    // Regular hirers must have 5 work photos (checked separately via upload endpoint)
    const job = await Job.create({
      hirer: req.user.id,
      hirerType: req.user.hirerType,
      title, skill, description, city, address,
      salaryMin, salaryMax, numberOfDays, deadline,
      isUrgent, workersNeeded, minExperience,
      accommodationAvail, foodAvail, isPermanent,
    });

    // Update hirer stats
    await require('../models/Hirer').findByIdAndUpdate(req.user.id, { $inc: { totalJobsPosted: 1 } });

    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── APPLY to a job (worker only) ──
   POST /api/jobs/:id/apply
*/
router.post('/:id/apply', protect, authorize('worker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.status !== 'active') return res.status(400).json({ success: false, message: 'This job is no longer accepting applications.' });

    // Check already applied
    const alreadyApplied = job.applications.find(a => a.worker.toString() === req.user.id);
    if (alreadyApplied) return res.status(400).json({ success: false, message: 'You have already applied to this job.' });

    job.applications.push({ worker: req.user.id });
    await job.save();

    res.json({ success: true, message: 'Application sent! The hirer will contact you directly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── WITHDRAW application (worker only) ──
   DELETE /api/jobs/:id/apply
*/
router.delete('/:id/apply', protect, authorize('worker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const appIndex = job.applications.findIndex(a => a.worker.toString() === req.user.id && a.status === 'pending');
    if (appIndex === -1) return res.status(400).json({ success: false, message: 'No pending application found to withdraw.' });

    job.applications.splice(appIndex, 1);
    await job.save();

    res.json({ success: true, message: 'Application withdrawn.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── HIRER confirms job complete ──
   PUT /api/jobs/:id/hirer-confirm
*/
router.put('/:id/hirer-confirm', protect, authorize('hirer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.hirer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not your job.' });

    job.hirerConfirmed   = true;
    job.hirerConfirmedAt = new Date();
    if (job.workerConfirmed) {
      job.status      = 'completed';
      job.completedAt = new Date();
    }
    await job.save();

    res.json({ success: true, message: 'Hirer confirmation saved!', bothConfirmed: job.workerConfirmed && job.hirerConfirmed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── WORKER confirms job complete ──
   PUT /api/jobs/:id/worker-confirm
*/
router.put('/:id/worker-confirm', protect, authorize('worker'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    if (!job.activeWorker || job.activeWorker.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'You are not the active worker for this job.' });

    job.workerConfirmed   = true;
    job.workerConfirmedAt = new Date();
    if (job.hirerConfirmed) {
      job.status      = 'completed';
      job.completedAt = new Date();
    }
    await job.save();

    res.json({ success: true, message: 'Worker confirmation saved!', bothConfirmed: job.workerConfirmed && job.hirerConfirmed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── RATE after job completion ──
   POST /api/jobs/:id/rate
*/
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.status !== 'completed')
      return res.status(400).json({ success: false, message: 'Job must be completed before rating.' });
    if (!job.workerConfirmed || !job.hirerConfirmed)
      return res.status(400).json({ success: false, message: 'Both parties must confirm before rating.' });

    let rating = await Rating.findOne({ job: job._id });
    if (!rating) rating = new Rating({ job: job._id, worker: job.activeWorker, hirer: job.hirer });

    const { stars, comment } = req.body;
    const role = req.user.role;

    if (role === 'hirer') {
      rating.workerRating  = stars;
      rating.workerComment = comment;
      rating.ratedByHirer  = true;
      // Update worker's average rating
      const worker = await Worker.findById(job.activeWorker);
      const newTotal  = worker.totalRatings + 1;
      const newAvg    = ((worker.averageRating * worker.totalRatings) + stars) / newTotal;
      worker.averageRating = Math.round(newAvg * 10) / 10;
      worker.totalRatings  = newTotal;
      worker.totalJobsDone += 1;
      await worker.save();
    } else if (role === 'worker') {
      rating.hirerRating  = stars;
      rating.hirerComment = comment;
      rating.ratedByWorker = true;
    }

    await rating.save();
    res.json({ success: true, message: 'Rating saved! Thank you.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
