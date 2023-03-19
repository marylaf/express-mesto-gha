const mongoose = require("mongoose");
const User = require("./user");
const { Schema } = mongoose;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: [Schema.Types.ObjectId], default: [], ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("card", cardSchema);
