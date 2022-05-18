/*
This middleware is used to check if the user is currently
logged in. 
Helps in to provide benefits to the logged in users,
like to post comment, download epub of the book.etc
*/

const isLoggedIn = (req, res, next) => {
    // passport adds the isAuthenticated funtion to the request object
    // we check if the user is authenticated, before giving him
    // permissions

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log("You must be logged in")
        // if not logged in, we redirect
        return res.redirect("/auth/login")
    }
    next()
}

// exports the middleware
module.exports = isLoggedIn