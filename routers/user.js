const express = require("express");
const router = express.Router();
const { default: wrapAsync } = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
    signupGet,
    signupPost,
    loginGet,
    loginPost,
    logout
} = require("../controllers/user.js");

// Signup
router.route("/signup")
    .get(signupGet)
    .post(wrapAsync(signupPost));

// Login
router.route("/login")
    .get(loginGet)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login"
        }),
        loginPost
    );

// Logout
router.get("/logout", logout);

module.exports = router;
