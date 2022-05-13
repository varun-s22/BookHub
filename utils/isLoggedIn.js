const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log("You must be logged in")
        return res.redirect("/auth/login")
    }
    next()
}
module.exports = isLoggedIn