// for development, we store the enviroment variables
// in .env file
if (process.env.NODE_ENV !== "production")
    require("dotenv").config()

const express = require("express")
const app = express()
const path = require("path")
const wrapAsync = require("./utils/wrapAsync")
const bookError = require("./utils/bookError")
const methodOverride = require('method-override')
const bookRoutes = require("./routes/book")
const ejsMate = require("ejs-mate")
const authRoutes = require("./routes/auth")
const getBooks = require("./utils/getBooks")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./modules/user")
const passport = require("passport")
const localPassportStrategy = require("passport-local")
const mongoSanitize = require('express-mongo-sanitize')
const mongoose = require('mongoose')
const mongoDBStore = require("connect-mongo")(session)

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/comment'
const port = process.env.PORT || 3000

// connects with the local database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

// on any error while connecting to database
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

// basic functions of our express app
// uses ejsMate for making partials and layouts, and adds the path of 
// view and public directories

app.engine('ejs', ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

// session store for PRODUCTION enviroment
const store = new mongoDBStore({
    url: dbUrl,
    secret: process.env.secret,
    touchAfter: 24 * 3600
})

store.on("error", (e) => {
    console.log("SESSION STORE ERROR!!", e)
})

// session config
const sessionConfig = {
    store: store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // session expires in 15 days
        expires: Date.now() + 1000 * 60 * 60 * 24 * 15,
        maxAge: 1000 * 60 * 60 * 24 * 15
    }
}

// uses the session and passport for authentication/authorization
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassportStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash());

app.use((req, res, next) => {
    // creates variables in the response object
    // to be accessed at any time
    res.locals.signedInUser = req.user
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    next()
})

// routes

app.get("/", wrapAsync(async (req, res) => {
    // home page
    try {
        let booksArr = await getBooks()
        res.render("home", { booksArr })
    }
    catch (e) {
        // shows if any error occured while rendering home page
        console.log(e)
    }
}))

// other routes (books/auth)
app.use("/book", bookRoutes)
app.use("/auth", authRoutes)

app.get("/search", wrapAsync(async (req, res) => {
    // the search route, which displays the results
    // based on the query searched for

    try {
        let bookName = req.query.bookName
        let booksArr = await getBooks(bookName)
        res.render("searchedBooks", { book: { ...booksArr, queryName: bookName } })
    }
    catch (e) {
        // if any error while searching for books
        console.log("Error in searching!!")
        console.log(e)
        res.redirect("/")
    }

}))


app.all("*", (req, res, next) => {
    // all other routes except for defined ones (basically errors)
    next(new bookError("Page not found!!", 404))
})

app.use((err, req, res, next) => {
    // error handler
    let { statusCode } = err
    if (!err.msg) err.msg = "Something went wrong!!"
    res.status(statusCode).render("error", { err })
})

app.listen(port, () => {
    // app listener
    console.log(`connected to port ${port}`)
})