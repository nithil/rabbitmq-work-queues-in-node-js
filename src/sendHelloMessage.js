const MessageBroker = require('./singleton/rabbitmq');

const helloQueue = 'hello';

const sendHelloMessage = async () => {
  const broker = await MessageBroker.getInstance();

  // { persistent: true } If truthy, the message will survive broker restarts provided it’s in a queue that also survives restarts
  for (let i = 0; i < 10; i++) {
    await broker.send(helloQueue, Buffer.from('Hello World!'), { persistent: true });
    console.log(" [x] Sent 'Hello World!'");
  }
};

sendHelloMessage();
