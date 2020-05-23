const amqp = require('amqplib');

/**
 * @var {Promise<MessageBroker>}
 */
let instance;

/**
 * Broker for async messaging
 */
class MessageBroker {
  /**
   * Initialize connection to rabbitMQ
   */
  async init() {
    try {
      this.connection = await amqp.connect(process.env.RABBIT_MQ_URL || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      return this;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  /**
   * Send message to queue
   * @param {String} queue Queue name
   * @param {Object} msg Message as Buffer
   */
  async send(queue, msg, options = {}) {
    if (!this.connection) {
      await this.init();
    }

    // asserts the queue exists, if it doesn’t exist assertQueue will create the queue
    // if durable is true, the queue will survive broker restarts
    await this.channel.assertQueue(queue, { durable: true });

    // sends a message to the queue
    this.channel.sendToQueue(queue, msg, options);
  }
}

/**
 * @return {Promise<MessageBroker>}
 */
MessageBroker.getInstance = async function () {
  if (!instance) {
    const broker = new MessageBroker();
    instance = await broker.init();
  }

  return instance;
};

module.exports = MessageBroker;
