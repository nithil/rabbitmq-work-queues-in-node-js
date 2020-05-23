const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const MessageBroker = require('./singleton/rabbitmq');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
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
