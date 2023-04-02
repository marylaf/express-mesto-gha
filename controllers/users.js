const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const Unauthorized = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { OK } = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.log('ERR', err, req.body);
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new NotFound('Такого пользователя не существует');
        return next(error);
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    // возвращаем записанные в базу данные пользователю
    .then((user) => res.status(OK).send({ data: user }))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      // console.log('ERR', err, req.body);
      if (err.code === 11000 || err.code === 11001) {
        const error = new ConflictError('Пользователь с таким email уже существует');
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        const error = new NotFound('Такого пользователя не существует');
        return next(error);
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
        const error = new NotFound('Такого пользователя не существует');
        return next(error);
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      // console.log('ERR', err, req.body);
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      return res.status(OK).send({ data: user });
    })
    .catch(() => {
      const error = new Unauthorized('Неправильные почта или пароль');
      return next(error);
    });
};

module.exports = {
  getUsers,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getCurrentUser,
};
