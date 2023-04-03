const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');

router.get('/users', getUsers);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), updateAvatar);

router.get('/users/me', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), getCurrentUser);

module.exports = router; // экспортировали роутер
