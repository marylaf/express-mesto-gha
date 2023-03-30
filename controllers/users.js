const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  SERVER_ERROR, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find(req.params)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    // возвращаем записанные в базу данные пользователю
    .then((user) => res.send({ data: user }))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный запрос' });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      return res.send({ data: user });
    })
    .catch(() => {
      res
        .status(UNAUTHORIZED)
        .send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
};
