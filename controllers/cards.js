const Card = require('../models/card');
const BadRequest = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const { OK, CreateSmt } = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find(req.params)
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CreateSmt).send({ data: card }))
    .catch((err) => {
      // console.log("ERR", err, req.body);
      if (err.name === 'ValidationError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const error = new NotFound('Такой карточки не существует');
        return next(error);
      }

      // Проверьте, является ли пользователь владельцем карточки
      if (card.owner.toString() !== userId) {
        const error = new Forbidden('У вас нет прав для удаления этой карточки');
        return next(error);
      }
      return Card.findByIdAndRemove(cardId).then((deletedCard) => res.send({ data: deletedCard }));
    }).catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const addLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFound('Такой карточки не существует');
        return next(error);
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        const error = new NotFound('Такой карточки не существует');
        return next(error);
      }
      return res.status(OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный запрос');
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  addLike,
};
