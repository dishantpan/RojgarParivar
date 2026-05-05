const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  // ── POSTED BY ──
  hirer:     { type: mongoose.Schema.Types.ObjectId, ref: 'Hirer', required: true },
  hirerType: { type: String, enum: ['regular', 'business'], required: true },

  // ── JOB DETAILS ──
  title:       { type: String, required: true },
  skill:       { type: String, required: true },
  description: { type: String },
  city:        { type: String, required: true },
  address:     { type: String, required: true },

  // ── SALARY ──
  salaryMin: { type: Number, required: true },
  salaryMax: { type: Number },

  // ── DURATION ──
  numberOfDays: { type: Number, required: true },
  startDate:    { type: Date },
  deadline:     { type: Date, required: true },

  // ── PHOTOS (mandatory for regular hirers — 5 photos) ──
  workPhotos: [{ type: String }], // Cloudinary URLs

  // ── BUSINESS SPECIFIC ──
  workersNeeded:       { type: Number },      // for bulk hiring
  minExperience:       { type: Number },      // years
  accommodationAvail:  { type: Boolean, default: false },
  foodAvail:           { type: Boolean, default: false },
  isPermanent:         { type: Boolean, default: false },

  // ── STATUS ──
  isUrgent: { type: Boolean, default: false },
  status:   { type: String, enum: ['active', 'in_progress', 'completed', 'closed'], default: 'active' },

  // ── APPLICATIONS ──
  applications: [{
    worker:     { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
    appliedAt:  { type: Date, default: Date.now },
    status:     { type: String, enum: ['pending', 'contacted', 'rejected', 'hired', 'withdrawn'], default: 'pending' },
  }],

  // ── ACTIVE WORKER (when job is in progress) ──
  activeWorker:      { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  workerConfirmed:   { type: Boolean, default: false },
  hirerConfirmed:    { type: Boolean, default: false },
  workerConfirmedAt: { type: Date },
  hirerConfirmedAt:  { type: Date },
  completedAt:       { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
