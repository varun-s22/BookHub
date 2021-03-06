/*
Here we have all the routes related to the books
The display page of any book, the posting/displaying of comments
the displaying of the data related to books
*/

const express = require("express")
const router = express.Router()
const Comments = require("../modules/comment")
const wrapAsync = require("../utils/wrapAsync")
const getBooks = require("../utils/getBooks")
const isLoggedIn = require("../utils/middlewares/isLoggedIn")
const isCommentAuthor = require("../utils/middlewares/isCommentAuthor")
const multer = require('multer')
const { storage, cloudinary } = require("../commentImages/images")

// we upload images on the server with the help of tool "mutler"
const upload = multer({ storage })

router.get("/:id", wrapAsync(async (req, res) => {
    // gets the display page of the book
    let bookName = req.params.id
    try {
        let bookData = await getBooks(bookName, 1)
        let key = Object.keys(bookData)[0]
        let bookInfo = bookData[key]
        res.render("book", { bookInfo })
    }
    catch (e) {
        // if caught any error, it redirects to the home page
        console.log(e)
        res.redirect("/")
    }
}))

// the logged in middleware is passed, to check if the user is logged in
// to post a comment
router.post("/:id/comment", isLoggedIn, upload.array("image"), wrapAsync(async (req, res) => {
    // posts the comment on the book page
    let { id } = req.params

    // creates a new comment from model
    const comment = new Comments({
        bookId: id,
        comment: req.body.comment,
        rating: req.body.rating
    })

    // sets the data for model
    comment.author = req.user._id

    // adds the links of images to this array
    comment.images = []
    for (let imgObj of req.files) {
        comment.images.push({ url: imgObj.path, imgName: imgObj.filename })
    }
    try {
        await comment.save()
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        // if any wrror caught while saving in data base, it shows it in console
        console.log("Error while saving in database")
        console.log(e)
    }
}))

router.delete("/:id/comment/:commentId", isLoggedIn, isCommentAuthor, wrapAsync(async (req, res) => {
    // deleting a comment
    // the second middleware makes sure the author 
    // of the comment can delete the comment

    try {
        let { id, commentId } = req.params
        let commentToBeDeleted = await Comments.findById(commentId)

        // finds the images of the corresponding comment
        // and deletes it on the cloudinary server
        for (let imgObj of commentToBeDeleted.images) {
            await cloudinary.uploader.destroy(imgObj.imgName)
        }
        await Comments.findByIdAndDelete(commentId)
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        // if any error while deleting comments
        console.log("Error while deleting comment")
        console.log(e)
    }
}))

router.get("/view/:id", isLoggedIn, (req, res) => {
    // renders the entire book in the browser
    // uses google books plugin to display
    let id = req.params.id
    res.render("viewBook", { data: { bookId: id } })
})

// exports the book routes
module.exports = router