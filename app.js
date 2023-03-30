const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use('/', auth, userRouter);

app.use('/', auth, cardRouter);
