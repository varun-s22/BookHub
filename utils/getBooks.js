/*
This utility is the main file of the website
We fetch the data of the books via Google Books Api
and displays them in our website
We use Axios to fetch data from the API
*/

// loads the API KEY from the .env files(development) 
const API_KEY = process.env.API_KEY
const axios = require("axios")
const Comments = require("../modules/comment")

// function which gives us the books
let getBooks = async (bookName = "subject:fiction", qty = 40) => {
    // stores the information in JS object
    let booksArr = {}

    // parameters passed during call from API
    let parameters = {
        q: bookName,
        filter: "free-ebooks",
        key: API_KEY,
        printType: "books",
        maxResults: qty
    }

    // gets the data with the help of axios
    let res = await axios.get(`https://www.googleapis.com/books/v1/volumes`, { params: parameters })

    // stores the book's information in JS Object
    let bookInfo = {}

    // iterates through all the books
    for (let books of res.data.items) {

        // stores the data of the books in an object
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

        try {
            // fetches the comments for the particular book, from the database
            let comments = await Comments.find({ bookId: id }).populate("author")

            // stores the comments along with other details of the book
            bookInfo.bookComments = comments
            booksArr[id] = bookInfo
        }
        catch (e) {
            // if any error occurs while fetching comments
            console.log("Error at comment section!!")
            console.log(e)
        }

    }
    // returns the JS object, where key is the book id, and value is the book object
    // made earlier of every book
    return booksArr
}

// the language object for decoding the correct language of the book 
let languageObj = {
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu',
    'fil': 'Filipino',
    'he': 'Hebrew'
}

// exports the book array for further usage
module.exports = getBooks