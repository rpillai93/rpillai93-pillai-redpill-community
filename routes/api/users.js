const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Accesstoken = require("../../models/Accesstoken");
//@route  POST api/users : the api used is POST, the url used will be api/users
//@desc   register user
//@access Public : a public route doesnt need tokens to access
router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "Please enter a valid email id").isEmail(),
    check(
      "password",
      "Please enter a password with atleast 6 characters"
    ).isLength({
      min: 6,
    }),
    check("tokenval", "Token is required to register!").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { name, email, password, tokenval } = req.body;

    const isAdmin = false;
    try {
      //************************************************************See if accesstoken exists
      let accesstoken = await Accesstoken.findOne({ tokenval });
      if (!accesstoken) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Token is invalid. You cannot create an account without a registration token.",
            },
          ],
        });
      }
      if (accesstoken.user) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "Token is invalid. You cannot create an account without a registration token.",
            },
          ],
        });
      }
      //************************************************************See if user exists
      let user = await User.findOne({
        email,
      }); //es6 format for objects with same name attributes
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists!",
            },
          ],
        });
      }

      //**************************************************************Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200", //default size
        r: "pg", // pg rated (no nudes allowed!),
        d: "mm", //default image or user icon if no gravatar
      });
      user = new User({
        name,
        email,
        avatar,
        password,
        isAdmin,
      });

      //*****************************************************************Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10); //10 rounds for level of encryption

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //*****************************************************************Set registered user to accesstoken
      const tokenFields = {};
      tokenFields.user = user.id;
      accesstoken = await Accesstoken.findOneAndUpdate(
        { tokenval },
        { $set: tokenFields },
        { new: true }
      );
      //*************************************************************************Return json web token
      const payload = {
        user: {
          id: user.id, //even though in mongodb database the id is called __id , mongoose calls it as id
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 }, //360000 should be 3600 during production. This is only for testing
        (err, token) => {
          if (err) throw err;
          res.json({ token, userID: user.id });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
