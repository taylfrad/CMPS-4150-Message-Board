const User = require('../models/User');

function renderRegister(res, { status = 200, error = null, values = {} } = {}) {
  return res.status(status).render('auth/register', {
    title: 'Register',
    error,
    values,
  });
}

function renderLogin(res, { status = 200, error = null, values = {} } = {}) {
  return res.status(status).render('auth/login', {
    title: 'Login',
    error,
    values,
  });
}

exports.getRegister = (req, res) => renderRegister(res);

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return renderRegister(res, {
      status: 400,
      error: 'All fields are required.',
      values: { username, email },
    });
  }
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    return res.redirect('/');
  } catch (err) {
    let message = 'Could not create account.';
    if (err.code === 11000) {
      message = 'Username or email is already in use.';
    } else if (err.name === 'ValidationError') {
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join(' ');
    }
    return renderRegister(res, {
      status: 400,
      error: message,
      values: { username, email },
    });
  }
};

exports.getLogin = (req, res) => renderLogin(res);

exports.postLogin = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return renderLogin(res, {
      status: 400,
      error: 'Enter your username/email and password.',
      values: { identifier },
    });
  }
  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier },
    ],
  });
  if (!user || !(await user.verifyPassword(password))) {
    return renderLogin(res, {
      status: 401,
      error: 'Invalid credentials.',
      values: { identifier },
    });
  }
  req.session.userId = user._id.toString();
  req.session.username = user.username;
  return res.redirect('/');
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
