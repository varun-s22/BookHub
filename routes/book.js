const express = require("express")
const router = express.Router()
const Comments = require("../modules/comment")
const wrapAsync = require("../utils/wrapAsync")
const getBooks = require("../utils/getBooks")


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
    }
}))

router.post("/:id/comment", wrapAsync(async (req, res) => {
    let { id } = req.params
    const comment = new Comments({
        bookId: id,
        comment: req.body.comment,
        rating: req.body.rating
    })
    try {
        await comment.save()
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        console.log("Error while saving in database")
        console.log(e)
    }
}))

router.delete("/:id/comment/:commentId", wrapAsync(async (req, res) => {
    try {
        let { id, commentId } = req.params
        await Comments.findByIdAndDelete(commentId)
        res.redirect(`/book/${id}`)
    }
    catch (e) {
        console.log("Error while deleting comment")
        console.log(e)
    }
}))

router.get("/view/:id", (req, res) => {
    let id = req.params.id
    res.render("viewBook", { data: { bookId: id } })
})

module.exports = router