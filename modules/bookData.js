const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema({
    bookId: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comments"
        }
    ]
})
module.exports = mongoose.model("Books", bookSchema)