const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WorkerSchema = new mongoose.Schema({
  // ── BASIC INFO ──
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  mobile:     { type: String, required: true, unique: true, trim: true },
  age:        { type: Number, required: true, min: 18 },
  gender:     { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  password:   { type: String, required: true, minlength: 6, select: false },

  // ── SKILLS ──
  skills: [{
    name:       { type: String, required: true },
    experience: { type: Number, default: 0 }, // years
  }],

  // ── LOCATION ──
  currentCity:    { type: String, required: true },
  preferredCities: [{ type: String }], // max 5

  // ── VERIFICATION ──
  aadharUrl:   { type: String },           // Cloudinary URL
  secondIdUrl: { type: String },           // Optional
  isVerified:  { type: Boolean, default: false },
  verifiedAt:  { type: Date },

  // ── AVAILABILITY ──
  isAvailable:      { type: Boolean, default: true },
  unavailableUntil: { type: Date },

  // ── PROFILE ──
  profilePhoto: { type: String },
  bio:          { type: String, maxlength: 500 },
  languages:    [{ type: String }],

  // ── STATS ──
  totalJobsDone:    { type: Number, default: 0 },
  averageRating:    { type: Number, default: 0 },
  totalRatings:     { type: Number, default: 0 },
  profileViews:     { type: Number, default: 0 },

  // ── ROLE ──
  role: { type: String, default: 'worker' },

}, { timestamps: true });

// Hash password before saving
WorkerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
WorkerSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Worker', WorkerSchema);
