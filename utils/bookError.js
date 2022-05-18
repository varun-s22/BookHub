/* 
We define our custom error model, for displaying the errors
to the clients,
Our model inherits from the JavaScript Error model.
We store the status code and the error message, and use them
to show the errors if any, encountered by our clients 
*/

class bookError extends Error {
    constructor(msg, statusCode) {
        // calls the constructor for Error
        super()

        // stores error message and status code
        this.msg = msg
        this.statusCode = statusCode
    }
}

// exports the custom error
module.exports = bookError