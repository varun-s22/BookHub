const express = require("express")
const router = express.Router()
const User = require("../modules/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const isLoggedIn = require("../utils/middlewares/isLoggedIn")

router.get("/register", (req, res) => {
    res.render("register")
})
router.post("/register", wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password, firstName, lastName } = req.body
        const user = new User({ email, username, firstName, lastName })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("successMsg", "You've successfully registered")
            res.redirect("/")
        })
    }
    catch (e) {
        console.log("Error at registering")
        console.log(e.message)
        req.flash("error", e.message)
        res.redirect("/auth/register")
    }
}))
router.get("/login", (req, res) => {
    res.render("login")
})
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth/login" }), (req, res) => {
    req.flash("success", "Welcome back")
    console.log("welcome back")
    let redirectURl = req.session.returnTo || "/"
    delete req.session.returnTo
    res.redirect(redirectURl)
})
router.get("/logout", isLoggedIn, (req, res) => {
    req.logout()
    res.redirect("/")
})
module.exports = router