const path = require('path');
const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');

const Notification = require('./models/Notification');

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const notificationRoutes = require('./routes/notifications');
const statsRoutes = require('./routes/stats');
const homeController = require('./controllers/homeController');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  if (req.body === undefined) req.body = {};
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(async (req, res, next) => {
  if (req.session.userId) {
    res.locals.currentUser = {
      id: req.session.userId,
      username: req.session.username,
    };
    try {
      res.locals.unreadCount = await Notification.countDocuments({
        user: req.session.userId,
        read: false,
      });
    } catch {
      res.locals.unreadCount = 0;
    }
  } else {
    res.locals.currentUser = null;
    res.locals.unreadCount = 0;
  }
  next();
});

app.use('/', authRoutes);
app.use('/topics', topicRoutes);
app.use('/notifications', notificationRoutes);
app.use('/stats', statsRoutes);

app.get('/', homeController.index);

app.use((req, res) => {
  res.status(404).render('home', { title: 'Not found' });
});

module.exports = app;
