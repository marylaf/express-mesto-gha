const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');

/* eslint-disable consistent-return */
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Unauthorized('Необходима авторизация');
    return next(error);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    const error = new Unauthorized('Необходима авторизация');
    return next(error);
  }
  req.user = payload;

  next();
};
