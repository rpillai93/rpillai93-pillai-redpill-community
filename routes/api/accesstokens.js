const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const TokenGenerator = require("uuid-token-generator");
const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58

const Accesstoken = require("../../models/Accesstoken");
//@route  POST api/accesstokens/generate : the api used is POST
//@desc  generate new accesstoken for user registration
//@access Admin: only admin access
router.post("/generate", async (req, res) => {
  try {
    var token, tokenval;
    var isNotUniqueToken = true;
    while (isNotUniqueToken) {
      tokenval = tokgen.generate();
      token = await Accesstoken.findOne({ tokenval });

      if (token == null) break;
    }

    token = new Accesstoken({ tokenval });
    await token.save();
    res.json(token);
  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;
