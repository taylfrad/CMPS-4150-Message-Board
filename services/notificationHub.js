const Topic = require('../models/Topic');
const TopicSubject = require('../patterns/TopicSubject');
const SubscriberObserver = require('../patterns/SubscriberObserver');

// Bridges the request-handling code to the Observer pattern:
// given a topic id and a freshly-created message, load the current
// subscribers, build a TopicSubject with one SubscriberObserver per
// subscriber, and fire the NEW_MESSAGE event.
exports.publishMessage = async (topicId, message) => {
  const topic = await Topic.findById(topicId).select('subscribers');
  if (!topic) return;

  const subject = new TopicSubject(topicId);
  for (const subscriberId of topic.subscribers) {
    subject.attach(new SubscriberObserver(subscriberId));
  }
  await subject.publishMessage(message);
};
