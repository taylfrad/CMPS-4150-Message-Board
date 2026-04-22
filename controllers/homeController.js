const Topic = require('../models/Topic');
const Message = require('../models/Message');

// Logged-out visitors just get the marketing hero.
// Logged-in visitors get a dashboard (T2.1 + T2.2):
//   - "Your topics": subscribed topics, each with the 2 most recent messages
//     and an Unsubscribe button.
//   - "Available to subscribe": every other topic, with a Subscribe button.
exports.index = async (req, res) => {
  if (!req.session.userId) {
    return res.render('home', { title: 'Home' });
  }

  const userId = req.session.userId;
  const allTopics = await Topic.find()
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .lean();

  const subscribed = [];
  const available = [];
  for (const t of allTopics) {
    const isSub = (t.subscribers || []).some((s) => String(s) === String(userId));
    if (isSub) subscribed.push(t);
    else available.push(t);
  }

  // For each subscribed topic, fetch the 2 most recent messages.
  const subscribedIds = subscribed.map((t) => t._id);
  let recentByTopic = new Map();
  if (subscribedIds.length > 0) {
    const messages = await Message.find({ topic: { $in: subscribedIds } })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .lean();
    for (const m of messages) {
      const key = String(m.topic);
      const bucket = recentByTopic.get(key) || [];
      if (bucket.length < 2) {
        bucket.push(m);
        recentByTopic.set(key, bucket);
      }
    }
  }
  for (const t of subscribed) {
    // Order oldest→newest inside the 2-message preview so it reads naturally.
    t.recentMessages = (recentByTopic.get(String(t._id)) || []).slice().reverse();
  }

  res.render('dashboard', {
    title: 'Home',
    subscribed,
    available,
  });
};
