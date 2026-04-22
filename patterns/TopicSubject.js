const Subject = require('./Subject');

// Concrete Subject: represents a single Topic for the purpose of
// notifying its subscribers. The app creates one of these per publish
// cycle (see services/notificationHub.js), attaches one observer per
// current subscriber loaded from the DB, then calls publishMessage().
class TopicSubject extends Subject {
  constructor(topicId) {
    super();
    this.topicId = topicId;
  }

  async publishMessage(message) {
    await this.notify({
      type: 'NEW_MESSAGE',
      topicId: this.topicId,
      message,
    });
  }
}

module.exports = TopicSubject;
