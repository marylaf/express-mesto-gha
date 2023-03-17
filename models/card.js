const mongoose = require("mongoose");
const User = require("./user");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { type: String, required: true },
  owner: {
    type: User.schema,
    required: true,
  },
  likes: { type: [User.schema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("card", cardSchema);
