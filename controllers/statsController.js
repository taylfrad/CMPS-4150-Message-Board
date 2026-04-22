const Topic = require('../models/Topic');
const Message = require('../models/Message');

// T8: access-count leaderboard across all topics plus a grand total.
exports.index = async (req, res) => {
  const topics = await Topic.find()
    .populate('author', 'username')
    .sort({ accessCount: -1, createdAt: -1 })
    .lean();

  const totalAccesses = topics.reduce(
    (sum, t) => sum + (t.accessCount || 0),
    0
  );
  const totalMessages = await Message.countDocuments();

  res.render('stats', {
    title: 'Stats',
    topics,
    totalAccesses,
    totalMessages,
  });
};
