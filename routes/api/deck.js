const express = require("express");
var fs = require("fs");
var path = require("path");
const router = express.Router();
const Deck = require("../../models/uu-game-models/Deck");
/******************************************************************************/
/*******************************POST ROUTES ***********************************/
/******************************************************************************/
//@route  POST api/deck/create
//@desc   create empty deck
//@access Private: only admin has access
router.post("/create", async (req, res) => {
  try {
    let deck = await Deck.findOne({ name: req.body.deckname });
    if (deck) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: The given deck name already exists in the data base!",
          },
        ],
      });
    }
    deck = new Deck({
      name: req.body.deckname,
      sources: [],
    });
    deck.save();
    res.json(deck);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route  POST api/deck/addcard
//@desc   add card to deck
//@access Private: only admin has access

router.post("/addcard", async (req, res) => {
  try {
    let deck = await Deck.findOne({ _id: req.body.deckId });

    if (!deck) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Deck not found!",
          },
        ],
      });
    }
    var result = deck.sources.filter((item) => item.cardId === req.body.cardId);

    if (result.length > 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Card already exists in the deck!",
          },
        ],
      });
    }
    deck.sources.push({ cardId: req.body.cardId, src: req.body.cardsrc });
    deck.save();
    res.json(deck);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
/******************************************************************************/
/*******************************GET ROUTES ***********************************/
/******************************************************************************/
//@route  GET api/deck/get
//@desc   get all decks in database
//@access Private: only admin has access
router.get("/get", async (req, res) => {
  try {
    let decks = await Deck.find();

    res.json(decks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
