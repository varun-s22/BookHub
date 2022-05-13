const Comments = require("../../modules/comment")

const isCommentAuthor = async (req, res, next) => {
    let { id, commentId } = req.params
    let comment = await Comments.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        console.log("You do not have permission to do that")
        return res.redirect(`/book/${id}`)
    }
    next()
}
module.exports = isCommentAuthor