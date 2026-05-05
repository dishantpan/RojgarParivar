const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  job:        { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  
  // Worker rating by Hirer
  workerRating:  { type: Number, min: 1, max: 5 },
  workerComment: { type: String },
  ratedByHirer:  { type: Boolean, default: false },

  // Hirer rating by Worker
  hirerRating:   { type: Number, min: 1, max: 5 },
  hirerComment:  { type: String },
  ratedByWorker: { type: Boolean, default: false },

  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  hirer:  { type: mongoose.Schema.Types.ObjectId, ref: 'Hirer',  required: true },

}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
