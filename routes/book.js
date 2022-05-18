const express = require("express")
const router = express.Router()
const Comments = require("../modules/comment")
const wrapAsync = require("../utils/wrapAsync")
const getBooks = require("../utils/getBooks")
const isLoggedIn = require("../utils/middlewares/isLoggedIn")
const isCommentAuthor = require("../utils/middlewares/isCommentAuthor")
const multer = require('multer')
const { storage, cloudinary } = require("../commentImages/images")
const upload = multer({ storage })

router.get("/:id", wrapAsync(async (req, res) => {
    let bookName = req.params.id
    try {
        let bookData = await getBooks(bookName, 1)
        let key = Object.keys(bookData)[0]
        let bookInfo = bookData[key]
        res.render("book", { bookInfo })
    }
    catch (e) {
        console.log(e)
        res.redirect("/")
    }
}))

router.post("/:id/comment", isLoggedIn, upload.array("image"), wrapAsync(async (req, res) => {
    let { id } = req.params
    const comment = new Comments({
        bookId: id,
        comment: req.body.comment,
        rating: req.body.rating
    })
    comment.author = req.user._id
    comment.images = []
    for (let imgObj of req.files) {
        comment.images.push({ url: imgObj.path, imgName: imgObj.filename })
    }
    try {
        await comment.save()
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        console.log("Error while saving in database")
        console.log(e)
    }
}))

router.delete("/:id/comment/:commentId", isLoggedIn, isCommentAuthor, wrapAsync(async (req, res) => {
    try {
        let { id, commentId } = req.params
        let commentToBeDeleted = await Comments.findById(commentId)
        for (let imgObj of commentToBeDeleted.images) {
            await cloudinary.uploader.destroy(imgObj.imgName)
        }
        await Comments.findByIdAndDelete(commentId)
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        console.log("Error while deleting comment")
        console.log(e)
    }
}))

router.get("/view/:id", isLoggedIn, (req, res) => {
    let id = req.params.id
    res.render("viewBook", { data: { bookId: id } })
})

module.exports = router