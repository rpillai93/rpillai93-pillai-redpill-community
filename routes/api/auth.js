const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
//NOTE: router.get("/") here is equivalent to router.get("/api/auth") as server.js is short-routing this file
//@route  GET api/auth : the api used is GET, the url used will be api/users
//@desc   register users, add profile etc
//@access Public : a public route doesnt need tokens to access
router.get("/", auth, async (req, res) => {
  try {
    //since in auth.js/middleware the decoded.user is the req.user, we can use req.user here
    const user = await User.findById(req.user.id).select("-password"); //password should not be passed back
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//@route  POST api/auth
//@desc   authenticate user and get token
//@access Public : a public route doesnt need tokens to access
router.post(
  "/",
  [
    check("email", "Please enter a valid email id").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      //************************************************************Check valid credentials
      let user = await User.findOne({
        email,
      }); //es6 format for objects with same name attributes
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials!",
            },
          ],
        });
      }

      //*************************************************************** Use bcrypt to compare passwords
      const isMatch = await bcrypt.compare(password, user.password); //password:plain text password entered by user, user.password: from database (encrypted)
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials!",
            },
          ],
        });
      }
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
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
