const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const { protect, authorize } = require('../middleware/auth');

/* ── GET all available workers (for hirers to browse) ──
   GET /api/workers?city=Surat&skill=Mason&page=1
*/
router.get('/', async (req, res) => {
  try {
    const { city, skill, page = 1, limit = 10 } = req.query;
    const query = { isAvailable: true };
    if (city)  query.currentCity = { $regex: city, $options: 'i' };
    if (skill) query['skills.name'] = { $regex: skill, $options: 'i' };

    const workers = await Worker.find(query)
      .select('-password')
      .sort({ averageRating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Worker.countDocuments(query);

    res.json({ success: true, count: workers.length, total, workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET single worker profile ──
   GET /api/workers/:id
*/
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found.' });

    // Increment profile views
    worker.profileViews += 1;
    await worker.save();

    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── UPDATE worker profile ──
   PUT /api/workers/profile
*/
router.put('/profile', protect, authorize('worker'), async (req, res) => {
  try {
    const { bio, skills, languages, preferredCities } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      { bio, skills, languages, preferredCities },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── TOGGLE availability ──
   PUT /api/workers/availability
*/
router.put('/availability', protect, authorize('worker'), async (req, res) => {
  try {
    const { isAvailable, unavailableUntil } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.user.id,
      { isAvailable, unavailableUntil: isAvailable ? null : unavailableUntil },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: isAvailable ? 'You are now visible to hirers!' : `Marked unavailable until ${unavailableUntil}`,
      worker,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET logged-in worker's own profile ──
   GET /api/workers/me
*/
router.get('/me', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id).select('-password');
    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
