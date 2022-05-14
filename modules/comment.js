const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
module.exports = mongoose.model("Comments", commentSchema)