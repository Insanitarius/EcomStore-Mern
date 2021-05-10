var express = require("express");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

router.post(
  "/signup",
  [
    check("name", "name should be at least 3 character long").isLength({
      min: 3,
    }),
    check("email", "email is required").isEmail(),
    check("password", "password should be 5-16 character long").isLength({
      min: 5,
      max: 16,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({
      min: 5,
      max: 16,
    }),
  ],
  signin
);

router.get("/testroute", isSignedIn, (req, res) => {
  res.send("A protected route");
});

router.get("/signout", signout);

module.exports = router;
