const express = require("express")
const app = express()
const path = require("path")
const axios = require("axios")
require("dotenv").config()
const API_KEY = process.env.API_KEY

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))

let getBooks = async (bookName = "subject:fiction", qty = 40) => {
    let booksArr = {}
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
        let id = books.id
        bookInfo = {
            id: books.id,
            downloadLink: books.accessInfo.epub.downloadLink,
            title: books.volumeInfo.title,
            subTitle: books.volumeInfo.subtitle,
            authors: books.volumeInfo.authors,
            publishedYear: books.volumeInfo.publishedDate,
            description: books.volumeInfo.description,
            pages: books.volumeInfo.pageCount,
            categories: books.volumeInfo.categories,
            imageLink: books.volumeInfo.imageLinks.thumbnail,
            language: languageObj[books.volumeInfo.language]
        }
        booksArr[id] = bookInfo
    }
    return booksArr
}

app.get("/", async (req, res) => {
    let booksArr = await getBooks()
    res.render("home", { booksArr })
})
app.get("/book/:id", async (req, res) => {
    let bookName = req.params.id
    let bookData = await getBooks(bookName, 1)
    let key = Object.keys(bookData)[0]
    let bookInfo = bookData[key]
    res.render("book", { bookInfo })
})
app.get("/search", async (req, res) => {
    let bookName = req.query.bookName
    let booksArr = await getBooks(bookName)
    res.render("searchedBooks", { book: { ...booksArr, queryName: bookName } })

})
app.get("/book/view/:id", (req, res) => {
    let id = req.params.id
    res.render("viewBook", { data: { bookId: id } })
})
app.get("/new", (req, res) => {
    res.render("new")
})
app.listen(3000, () => {
    console.log("connected to port 3000")
})


let languageObj = { 'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian', 'az': 'Azerbaijani', 'eu': 'Basque', 'be': 'Belarusian', 'bn': 'Bengali', 'bs': 'Bosnian', 'bg': 'Bulgarian', 'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)', 'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish', 'nl': 'Dutch', 'en': 'English', 'eo': 'Esperanto', 'et': 'Estonian', 'tl': 'Filipino', 'fi': 'Finnish', 'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gu': 'Gujarati', 'ht': 'Haitian Creole', 'ha': 'Hausa', 'haw': 'Hawaiian', 'iw': 'Hebrew', 'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian', 'is': 'Icelandic', 'ig': 'Igbo', 'id': 'Indonesian', 'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese', 'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh', 'km': 'Khmer', 'ko': 'Korean', 'ku': 'Kurdish (Kurmanji)', 'ky': 'Kyrgyz', 'lo': 'Lao', 'la': 'Latin', 'lv': 'Latvian', 'lt': 'Lithuanian', 'lb': 'Luxembourgish', 'mk': 'Macedonian', 'mg': 'Malagasy', 'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi', 'mn': 'Mongolian', 'my': 'Myanmar (Burmese)', 'ne': 'Nepali', 'no': 'Norwegian', 'ps': 'Pashto', 'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian', 'ru': 'Russian', 'sm': 'Samoan', 'gd': 'Scots Gaelic', 'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi', 'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish', 'su': 'Sundanese', 'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai', 'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu', 'uz': 'Uzbek', 'vi': 'Vietnamese', 'cy': 'Welsh', 'xh': 'Xhosa', 'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu', 'fil': 'Filipino', 'he': 'Hebrew' }