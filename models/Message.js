const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Message cannot be empty.'],
      trim: true,
      minlength: [1, 'Message cannot be empty.'],
      maxlength: [2000, 'Message must be at most 2000 characters.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
