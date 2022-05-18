/* 
The comment Model, stores the comments given to a book
by our customers, in our database
We store the rating/comment/attachments, and the name
of the person making a comment, in our database, and 
shows them in our page
*/

const mongoose = require("mongoose")
const Schema = mongoose.Schema

// schema for comment
const commentSchema = new Schema({
    bookId: String,
    comment: String,
    rating: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    images: [
        {
            url: String,
            imgName: String
        }
    ]
})

// exporting the model
module.exports = mongoose.model("Comments", commentSchema)