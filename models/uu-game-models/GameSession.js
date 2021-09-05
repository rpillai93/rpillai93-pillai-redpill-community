const mongoose = require("mongoose");
const { ProfileSchema } = require("../Profile");
const GameSessionSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deck",
  },
  playerLimit: {
    type: Number,
    required: true,
  },
  playersInGame: {
    type: Number,
  },
  winnerDeclared: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    gamename: {
      type: String,
    },
  },
  players: [ProfileSchema],
  createdAt: {
    type: Date,
  },
});
GameSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
module.exports = GameSession = mongoose.model("gamesession", GameSessionSchema);
