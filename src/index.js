const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const MessageBroker = require('./singleton/rabbitmq');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.post('/subscribe', async (req, res) => {
  await sendToQueue(req.body);
  res.send('Thank you. You are successfully subscribed.');
});

app.listen(3000, () => console.log('App is listening on port 3000!'));

const sendToQueue = async (msg) => {
  const emailQueue = 'email';

  const broker = await MessageBroker.getInstance();

  await broker.send(emailQueue, Buffer.from(JSON.stringify(msg)), { persistent: true });

  console.log('Message sent to queue : ', msg);
};
