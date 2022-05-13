const express = require("express")
const app = express()
const path = require("path")
const wrapAsync = require("./utils/wrapAsync")
const bookError = require("./utils/bookError")
const methodOverride = require('method-override')
require("dotenv").config()
const bookRoutes = require("./routes/book")
const ejsMate = require("ejs-mate")
const authRoutes = require("./routes/auth")
const getBooks = require("./utils/getBooks")
const session = require("express-session")
const flash = require("connect-flash")
const User = require("./modules/user")
const passport = require("passport")
const localPassportStrategy = require("passport-local")


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/comment', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.engine('ejs', ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 15,
        maxAge: 1000 * 60 * 60 * 24 * 15
    }
}
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassportStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash());

app.use((req, res, next) => {
    res.locals.signedInUser = req.user
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    next()
})



app.get("/", wrapAsync(async (req, res) => {
    try {
        let booksArr = await getBooks()
        res.render("home", { booksArr })
    }
    catch (e) {
        console.log(e)
    }
}))

app.use("/book", bookRoutes)
app.use("/auth", authRoutes)
app.get("/search", wrapAsync(async (req, res) => {
    try {
        let bookName = req.query.bookName
        let booksArr = await getBooks(bookName)
        res.render("searchedBooks", { book: { ...booksArr, queryName: bookName } })
    }
    catch (e) {
        console.log("Error in searching!!")
        console.log(e)
    }

}))
app.all("*", (req, res, next) => {
    next(new bookError("Page not found!!", 404))
})
app.use((err, req, res, next) => {
    let { statusCode } = err
    if (!err.msg) err.msg = "Something went wrong!!"
    res.status(statusCode).render("error", { err })
})
app.listen(3000, () => {
    console.log("connected to port 3000")
})