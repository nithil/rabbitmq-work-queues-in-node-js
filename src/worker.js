/**
 * wiki for methods https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html
 */

const MessageBroker = require('./singleton/rabbitmq');

const { sendEmailTo } = require('./helpers/mailer');

const { sleep } = require('./helpers/sleep');

// By default RabbitMQ will send new messages to the workers using round-robin algorithm

const listenToHelloQueue = async (broker) => {
  try {
    const channel = await broker.connection.createChannel();
    // This tells RabbitMQ not to give more than two message to a worker at a time (Fair dispatch)
    channel.prefetch(2);

    // asserts the queue exists, if it doesn’t exist assertQueue will create the queue
    const helloQueue = 'hello';
    await channel.assertQueue(helloQueue, { durable: true });

    // worker 1 for helloQueue
    console.log(' [*] worker 1 waiting for messages in %s ', helloQueue);
    channel.consume(
      helloQueue,
      async (msg) => {
        await sleep(5000);
        console.log(' [x] Received by worker - 1 %s', msg.content.toString());

        // An ack(nowledgement) is sent back by the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it.
        channel.ack(msg);
      },
      // when noAck is true the rabbitmq server won’t wait for the acknowledgment from the client side after processing. The server will delete the message from the queue as soon as it is delivered to the client.
      { noAck: false }
    );

    // worker 2 for helloQueue
    console.log(' [*] worker 2 waiting for messages in %s ', helloQueue);
    channel.consume(
      helloQueue,
      async (msg) => {
        console.log(' [x] Received by worker - 2 %s', msg.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {
    throw error;
  }
};

const listenToEmailQueue = async (broker) => {
  try {
    const channel = await broker.connection.createChannel();
    // This tells RabbitMQ not to give more than four message to a worker at a time (Fair dispatch)
    channel.prefetch(4);

    const emailQueue = 'email';
    await channel.assertQueue(emailQueue, { durable: true });

    // worker 1 for emailQueue
    console.log(' [*] worker 1 waiting for messages in %s ', emailQueue);
    channel.consume(
      emailQueue,
      async (msg) => {
        console.log(' [x] Received by worker - 1 %s', msg.content.toString());

        const form = JSON.parse(msg.content.toString());
        await sendEmailTo(form.email);

        channel.ack(msg);
      },
      { noAck: false }
    );

    // worker 2 for emailQueue
    console.log(' [*] worker 2 waiting for messages in %s ', emailQueue);
    channel.consume(
      emailQueue,
      async (msg) => {
        await sleep(5000);
        console.log(' [x] Received by worker - 2 %s', msg.content.toString());

        const form = JSON.parse(msg.content.toString());
        await sendEmailTo(form.email);

        channel.ack(msg);
      },
      { noAck: false }
    );
  } catch (error) {
    throw error;
  }
};

const connectAndListen = async () => {
  try {
    const broker = await MessageBroker.getInstance();

    await listenToHelloQueue(broker);
    await listenToEmailQueue(broker);
  } catch (error) {
    console.error(error);
  }
};

connectAndListen();
