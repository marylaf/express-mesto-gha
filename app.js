const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64139cc148008318561dc320',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(express.json());

app.use('/', userRouter);

app.use('/', cardRouter);
