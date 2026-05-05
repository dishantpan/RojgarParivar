const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HirerSchema = new mongoose.Schema({
  // ── TYPE ──
  hirerType: { type: String, enum: ['regular', 'business'], required: true },

  // ── COMMON FIELDS ──
  name:      { type: String, required: true, trim: true },
  mobile:    { type: String, required: true, trim: true },
  mobile2:   { type: String },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6, select: false },
  city:      { type: String, required: true },
  address:   { type: String },

  // ── REGULAR HIRER ONLY ──
  isOtpVerified: { type: Boolean, default: false },

  // ── BUSINESS ONLY ──
  companyName:    { type: String },
  businessType:   { type: String },
  yearsInBusiness:{ type: Number },
  ownerName:      { type: String },
  gstNumber:      { type: String },
  tradeLicenseUrl:{ type: String }, // Cloudinary URL

  // ── BUSINESS VERIFICATION ──
  isAdminVerified:   { type: Boolean, default: false },
  verificationStatus:{ type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason:   { type: String },
  verifiedAt:        { type: Date },

  // ── STATS ──
  totalJobsPosted: { type: Number, default: 0 },
  averageRating:   { type: Number, default: 0 },
  totalRatings:    { type: Number, default: 0 },

  // ── ROLE ──
  role: { type: String, default: 'hirer' },

}, { timestamps: true });

// Hash password before saving
HirerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
HirerSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Hirer', HirerSchema);
