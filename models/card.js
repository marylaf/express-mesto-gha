const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: 'Поле "link" должно быть валидной ссылкой',
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: { type: [Schema.Types.ObjectId], default: [], ref: 'user' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
