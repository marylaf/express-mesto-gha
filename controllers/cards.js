const Card = require("../models/card");
const { SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require("../errors/errors");

const getCards = (req, res) => {
  Card.find(req.params)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: "Внутренняя ошибка сервера" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // console.log("ERR", err, req.body);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Некорректный запрос" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Такой карточки не существует" });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Некорректный запрос" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // console.log("ERR", err, req.body);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Некорректный запрос" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND)
          .send({ message: "Такой карточки не существует" });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Некорректный запрос" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Внутренняя ошибка сервера" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  addLike,
};
