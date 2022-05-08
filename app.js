const express = require("express")
const app = express()
const path = require("path")
const axios = require("axios")
require("dotenv").config()
const API_KEY = process.env.API_KEY

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))

let books = {}

let frontpage = async () => {
    let parameters = {
        filter: "free-ebooks",
        key: API_KEY,
        printType: "books",
        maxResults: 40
    }
    let res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction`, { params: parameters })
    for (let book of res.data.items) {
        let id = book.id
        let bookInfo = {
            title: book.volumeInfo.title,
            imageLink: book.volumeInfo.imageLinks.thumbnail
        }
        books[id] = bookInfo
    }
}
app.get("/", (req, res) => {
    frontpage()
    res.render("home", { books })
})
app.get("/book/:id", async (req, res) => {
    let bookId = req.params.id
    let bookName = books[bookId].title
    let bookInfo = await getBooks(bookName, 1)
    res.render("book", { bookInfo })
})
// app.post("/", (req, res) => {
//     arr.push(req.body.name)
//     console.log(req.body)
//     res.redirect("/")
// })
app.get("/new", (req, res) => {
    res.render("new")
})
app.listen(3000, () => {
    console.log("connected to port 3000")
})

let getBooks = async (bookName, qty) => {
    let parameters = {
        q: bookName,
        filter: "free-ebooks",
        key: API_KEY,
        printType: "books",
        maxResults: qty
    }
    let res = await axios.get(`https://www.googleapis.com/books/v1/volumes`, { params: parameters })
    let bookInfo = {}
    for (let books of res.data.items) {
        bookInfo = {
            downloadLink: books.accessInfo.epub.downloadLink,
            title: books.volumeInfo.title,
            subTitle: books.volumeInfo.subtitle,
            authors: books.volumeInfo.authors,
            publishedYear: books.volumeInfo.publishedDate,
            description: books.volumeInfo.description,
            pages: books.volumeInfo.pageCount,
            categories: books.volumeInfo.categories,
            imageLink: books.volumeInfo.imageLinks.thumbnail,
            language: books.volumeInfo.language
        }
    }
    return bookInfo
}
// getBook("comedy")
function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

frontpage()

