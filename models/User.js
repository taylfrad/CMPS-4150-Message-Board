const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters.'],
      maxlength: [32, 'Username must be at most 32 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.virtual('password').set(function (pw) {
  this._password = pw;
});

userSchema.pre('validate', async function () {
  if (this._password === undefined) return;
  if (typeof this._password !== 'string' || this._password.length < 8) {
    this.invalidate('password', 'Password must be at least 8 characters.');
    return;
  }
  this.passwordHash = await bcrypt.hash(this._password, 10);
  this._password = undefined;
});

userSchema.methods.verifyPassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
