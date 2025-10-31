const User = require("../models/user.js");

module.exports.signupGet = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("signup");
    }
}

module.exports.loginGet = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginPost = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}