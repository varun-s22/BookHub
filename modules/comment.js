const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    bookId: String,
    comment: String,
    rating: String
})
module.exports = mongoose.model("Comments", commentSchema)