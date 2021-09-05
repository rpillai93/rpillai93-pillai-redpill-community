const mongoose = require("mongoose");
const DeckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sources: {
    type: Array,
    required: true,
  },
});

module.exports = Deck = mongoose.model("deck", DeckSchema);
