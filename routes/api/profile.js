const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const { Profile } = require("../../models/Profile");
const User = require("../../models/User");
//@route  GET api/profile/me : the api used is GET, the url used will be api/users
//@desc   get current user's profile
//@access Private: only current user has access
router.get("/me", auth, async (req, res) => {
  //since we want to hit the /api/profile/me endpoint

  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      [
        // referring to 'user' reference from profile model
        ["name", "avatar"], // referring to attributes from the user model
      ]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//@route  POST api/profile : the api used is GET, the url used will be api/users
//@desc   Create or update user profile
//@access Private: only current user has access
router.post(
  "/",
  [
    auth,
    [
      check(
        "gamename",
        "You need a gamer name so as to not be stabbed by unicorns!"
      )
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (
      req.body.gamename.split(" ").length > 1 ||
      req.body.gamename.length > 10
    ) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "Error: Invalid player name format. Player name should not contain spaces and/or exceed 10 characters.",
          },
        ],
      });
    }
    const { gamename } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (gamename) profileFields.gamename = gamename;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
