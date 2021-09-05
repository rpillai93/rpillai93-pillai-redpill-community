const mongoose = require("mongoose");
const CardSchema = require("./Card");
const CardsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stID: {
    type: Number,
    required: true,
  },
  cards: [CardSchema],
});

module.exports = {
  Cards: mongoose.model("cards", CardsSchema),
  Card: mongoose.model("card", CardSchema),
};
