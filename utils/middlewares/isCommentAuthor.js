// gets the comment model from the database
const Comments = require("../../modules/comment")

/* 
This middleware is used to identify the author of
the comment.
Only the author of the comment can delete their comment.
*/

const isCommentAuthor = async (req, res, next) => {
    // matches the currently signed in user to 
    // the author of comments(posted in the book's page)

    let { id, commentId } = req.params
    let comment = await Comments.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        // checks on the server side as well
        console.log("You do not have permission to do that")
        return res.redirect(`/book/${id}`)
    }
    next()
}
// exports the middleware
module.exports = isCommentAuthor