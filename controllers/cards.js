const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find(req.params)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // console.log("ERR", err, req.body);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка запроса" });
      }
      return res.status(500).send({ message: "Ошибка" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Такого пользователя не существует" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: "Ошибка" });
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
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка запроса" });
      }
      return res.status(500).send({ message: "Ошибка" });
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка запроса" });
      }
      return res.status(500).send({ message: "Ошибка" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  addLike,
};
