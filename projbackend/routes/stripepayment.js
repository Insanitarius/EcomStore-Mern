const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

const { makepayment } = require("../controllers/stripepayment");

router.param("userId", getUserById);
router.post("/stripepayment/:userId", isSignedIn, isAuthenticated, makepayment);

module.exports = router;
