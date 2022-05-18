/* 
The user model stores the details of the user,
registered with us. We store the first name,last name
and the email of the user.
We encrypt the user's password before storing it in our
database, hence we use passport for authentication purposes
*/

const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema

// user schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})
// password and username are stored with the help of passport
UserSchema.plugin(passportLocalMongoose)

// exportng the user model
module.exports = mongoose.model("User", UserSchema)
