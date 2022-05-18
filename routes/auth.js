/* 
This file contains all the routes related to the authorization
of the user.
*/

const express = require("express")
const router = express.Router()
const User = require("../modules/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const isLoggedIn = require("../utils/middlewares/isLoggedIn")

router.get("/register", (req, res) => {
    // we render the register page for get requert
    res.render("register")
})

router.post("/register", wrapAsync(async (req, res, next) => {
    // on submitting the form, we check if details matches,
    // and then proceed further.
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
        // if there was any error while registering
        console.log("Error at registering")
        console.log(e.message)
        req.flash("error", e.message)
        // we redirect user to register page once again
        res.redirect("/auth/register")
    }
}))

router.get("/login", (req, res) => {
    // renders the login page
    res.render("login")
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/auth/login" }), (req, res) => {
    // passport middlewares are passed
    req.flash("success", "Welcome back")

    // stores the last URL, from where user was redirected to login 
    let redirectURl = req.session.returnTo || "/"

    // deletes the last session
    delete req.session.returnTo
    res.redirect(redirectURl)
})

router.get("/logout", isLoggedIn, (req, res) => {
    // logs out of the account
    // in built passport method
    req.logout()
    res.redirect("/")
})

//exports the auth routes 
module.exports = router