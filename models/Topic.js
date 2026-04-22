const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters.'],
      maxlength: [120, 'Title must be at most 120 characters.'],
    },
    body: {
      type: String,
      trim: true,
      maxlength: [2000, 'Body must be at most 2000 characters.'],
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subscribers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
    accessCount: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
