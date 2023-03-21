const router = require('express').Router();

const { getCards } = require('../controllers/cards');
const { createCard } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { addLike } = require('../controllers/cards');
const { deleteLike } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
