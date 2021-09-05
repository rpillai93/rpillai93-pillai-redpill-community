const express = require("express");
var fs = require("fs");
var path = require("path");
const router = express.Router();
const multer = require("multer");
var sizeOf = require("image-size");
const imageThumbnail = require("image-thumbnail");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./client/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  //accept a file save
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter,
});
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const { Cards, Card } = require("../../models/uu-game-models/Cards");
/******************************************************************************/
/*******************************POST ROUTES ***********************************/
/******************************************************************************/
//@route  POST api/upload/card
//@desc   create card
//@access Private: only admin has access
router.post("/card", upload.single("uploaded_file"), async (req, res) => {

  try {
    if (
      !req.file ||
      (req.file &&
        !(
          req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png" ||
          req.file.mimetype === "image/jpg"
        ))
    ) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Error: Invalid file or format. Only jpeg or png type images less than 2MB in file size are allowed!",
          },
        ],
      });
    }
     // console.log(req.file)

    var cardName = req.file.originalname;
    var stID = parseInt(cardName.split("_")[0]);
    var ctID = stID > 0 && stID < 5 ? 10 : 20;

    if (stID < 1 || stID > 8) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Invalid card filename format!",
          },
        ],
      });
    }

    let cardsColl = await Cards.findOne({ stID });
  
      if (!cardsColl) {
          return res.status(400).json({
              errors: [
                  {
                      msg: "Error: The stID was not recognized!",
                  },
              ],
          });
      }
    var result = cardsColl.cards.filter(
      (card) => card.name === req.file.originalname
    );
   
    if (result.length > 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Card already exists in the database!",
          },
        ],
      });
    }
   
    let options = { width: 100, height: 142 };
    const buf = await imageThumbnail(
      "./client/public/uploads/" + req.file.originalname,
      options
    );

    var tnName = cardName.split(".")[0] + "_tn.jpg";
      fs.writeFile(path.join("./client/public/uploads/", tnName), buf, function (error) {
      if (error) {
        throw error;
      } else {
        console.log("File created from base64 string!");
        return true;
      }
    });
      var dimensions = sizeOf("./client/public/uploads/" + req.file.originalname);
      var src = "./uploads/" + req.file.originalname;
    card = new Card({
      name: req.file.originalname,
      stID,
      ctID,
        src: src,
        thumbnail: src.split(".")[0] + "_tn.jpg",
      cardWidth: dimensions.width,
      cardHeight: dimensions.height,
    });

    cardsColl.cards.push(card);
    cardsColl.save();
    res.json({ fileName: card.name, filePath: card.path });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/upload/cards
//@desc   create structured cards collection
//@access Private: only admin has access
router.post("/cards", async (req, res) => {
/*    console.log(req)*/
  try {
    var name = "baby";
    var stID = 1;
    var cards = [];
    let baby = new Cards({ name, stID, cards });
    baby.save();

    name = "basic";
    stID = 2;
    let basic = new Cards({ name, stID, cards });
    basic.save();

    name = "magical";
    stID = 3;
    let magical = new Cards({ name, stID, cards });
    magical.save();

    name = "ultimate";
    stID = 4;
    let ultimate = new Cards({ name, stID, cards });
    ultimate.save();

    name = "downgrade";
    stID = 5;
    let downgrade = new Cards({ name, stID, cards });
    downgrade.save();

    name = "upgrade";
    stID = 6;
    let upgrade = new Cards({ name, stID, cards });
    upgrade.save();

    name = "instant";
    stID = 7;
    let instant = new Cards({ name, stID, cards });
    instant.save();

    name = "magic";
    stID = 8;
    let magic = new Cards({ name, stID, cards });
    magic.save();

    res.json({ msg: "SUCCESS!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
/******************************************************************************/
/*******************************GET ROUTES ***********************************/
/******************************************************************************/
//@route  GET api/upload/cards
//@desc   get all cards in database
//@access Private: only admin has access
router.get("/cards", async (req, res) => {
  try {
    let cards = await Cards.find();
 /*     console.log(cards)*/
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route  GET api/upload/card
//@desc   get card by name
//@access Private: only admin has access
router.get("/card", async (req, res) => {
  var stID = parseInt(req.body.name.split("_")[0]);

  try {
    let cardsObj = await Cards.find({ stID });

    if (!cardsObj || cardsObj[0].cards.length === 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Invalid file name format!",
          },
        ],
      });
    }
    const cards = cardsObj[0].cards;

    var found = false;
    var card = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].name === req.body.name) {
        card = cards[i];
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Card does not exist in database!",
          },
        ],
      });
    }

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
/******************************************************************************/
/*******************************DELETE ROUTES ***********************************/
/******************************************************************************/
//@route  DELETE api/upload/card
//@desc   delete card by id
//@access Private: only admin has access
router.delete("/card", async (req, res) => {
  try {
    let cardsObj = await Cards.find({ stID: req.body.stID });

    if (!cardsObj || cardsObj[0].cards.length === 0) {
      return res.status(400).json({
        errors: [
          {
            msg: "Error: Invalid card object or stID. Could not delete card!",
          },
        ],
      });
    }

    var stID = parseInt(req.body.stID);
    cardsObj = await Cards.findOneAndUpdate(
      { stID: stID },
      { $pull: { cards: { _id: req.body.id } } },
      { new: true }
    ).exec();

    res.json({ msg: "Card was deleted from the database successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
