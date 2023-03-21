const User = require('../models/user');
const { SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find(req.params)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
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
  const { name, about, avatar } = req.body;

  // записываем данные в базу
  User.create({ name, about, avatar })
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateAvatar,
  updateProfile,
};
