const router = require('express').Router();

const { getUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { getCurrentUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/me', getCurrentUser);

module.exports = router; // экспортировали роутер
