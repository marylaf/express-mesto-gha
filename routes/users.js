const router = require('express').Router();

const { getUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const { updateAvatar } = require('../controllers/users');
const { updateProfile } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router; // экспортировали роутер
