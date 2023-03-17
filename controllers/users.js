const User = require("../models/user");

const getUsers = (req, res) => {
  User.find(req.params)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: "Ошибка" }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Такого пользователя не существует" });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Невалидный ID пользователя" });
      }
      res.status(500).send({ message: "Ошибка" });
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
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Ошибка запроса" });
      }
      res.status(500).send({ message: "Ошибка" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
