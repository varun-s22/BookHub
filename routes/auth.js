const express = require("express")
const router = express.Router()
const User = require("../modules/user")
const flash = require("connect-flash")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")

router.get("/register", (req, res) => {
    res.render("register")
})
router.post("/register", wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
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
router.get("/logout", (req, res) => {
    req.logout()
    // res.flash("success", "Successfully logged out")
    res.redirect("/")
})
module.exports = router