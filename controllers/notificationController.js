const Notification = require('../models/Notification');

exports.index = async (req, res) => {
  const notifications = await Notification.find({ user: req.session.userId })
    .populate('topic', 'title')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.render('notifications/index', { title: 'Notifications', notifications });
};

exports.markRead = async (req, res) => {
  const note = await Notification.findOne({
    _id: req.params.id,
    user: req.session.userId,
  });
  if (!note) return res.redirect('/notifications');
  note.read = true;
  await note.save();
  res.redirect(`/topics/${note.topic}`);
};

exports.markAllRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.session.userId, read: false },
    { $set: { read: true } }
  );
  res.redirect('/notifications');
};
