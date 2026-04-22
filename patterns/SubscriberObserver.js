const Observer = require('./Observer');
const Notification = require('../models/Notification');

// Concrete Observer: one instance represents one subscribed user.
// When attached to a TopicSubject and that subject fires a NEW_MESSAGE
// event, this observer writes a Notification row for its user so they
// will see it in /notifications.
class SubscriberObserver extends Observer {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  async update(subject, event) {
    if (event.type !== 'NEW_MESSAGE') return;
    // Don't notify someone about their own post.
    if (String(event.message.author) === String(this.userId)) return;

    await Notification.create({
      user: this.userId,
      topic: event.topicId,
      message: event.message._id,
      text: 'New post in a topic you follow',
    });
  }
}

module.exports = SubscriberObserver;
