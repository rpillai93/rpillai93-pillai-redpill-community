const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const GameSession = require("../../models/uu-game-models/GameSession");
const Deck = require("../../models/uu-game-models/Deck");
const { Profile } = require("../../models/Profile.js");
/******************************************************************************/
/*******************************POST ROUTES ***********************************/
/******************************************************************************/
//@route  POST api/game/create
//@desc   create game session
//@access Private: only user has access
router.post("/create", auth, async (req, res) => {
  // console.log(req.user);
  try {
    const profile = await Profile.findOne({ user: req.user.id }).select(
      "_id gamename"
    );
    if (!profile) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Error: Could not create game session. Please contact the admin.",
          },
        ],
      });
    }

    let deck = await Deck.findById(req.body.deckId);

    if (!deck) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Error: Could not create game session. Please contact the admin.",
          },
        ],
      });
    }

    var createdBy = {};
    createdBy.profileId = profile._id;
    createdBy.gamename = profile.gamename;
    var session = new GameSession({
      deck: req.body.deckId,
      playerLimit: req.body.playerLimit,
      playersInGame: 0,
      winnerDeclared: false,
      createdBy: createdBy,
      players: [],
      createdAt: new Date(),
    });
    session.save();

    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route  POST api/game/register
//@desc   register profile to game session
//@access Private: only user has access
router.post("/register", auth, async (req, res) => {
  // console.log(req.user);
  try {
    let session = await GameSession.findById(req.body.sessionId);
    if (!session) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Could not join session.",
          },
        ],
      });
    }
    const profile = await Profile.findById(req.body.profileId).select(
      "_id gamename"
    );

    if (!profile) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Could not join session.",
          },
        ],
      });
    }
    var userRegistered = false;
    for (var i = 0; i < session.players.length; i++) {
      var player = session.players[i];

      if (player._id.equals(req.body.profileId)) {
        userRegistered = true;
        break;
      }
    }
    if (!userRegistered) {
      session.players.push({ _id: profile._id, gamename: profile.gamename });
      userRegistered = true;
    }

    if (userRegistered)
      console.log(
        'User profile "' +
          profile.gamename +
          '" was registered to game successfully...'
      );
    else {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Could not join session.",
          },
        ],
      });
    }

    session.save();
    res.json(userRegistered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
/******************************************************************************/
/*******************************GET ROUTES ***********************************/
/******************************************************************************/
//@route  GET api/game/findgames
//@desc   get all sessions available in database
//@access Private: only user has access
router.get("/findgames", auth, async (req, res) => {
  try {
    let sessions = await GameSession.find();
    if (!sessions) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: No game sessions found.",
          },
        ],
      });
    }
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: No game sessions found.",
          },
        ],
      });
    }
    var foundGames = [];
    sessions.forEach((session, i) => {
      if (session.playerLimit > session.players.length) {
        foundGames.push(session);
      } else {
        var { players } = session;

        for (var j = 0; j < players.length; j++) {
          if (profile._id.equals(players[j]._id)) {
            foundGames.push(session);
            break;
          }
        }
      }
    });
    res.json(foundGames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
