/*
This utility function is used for checking the errors in async function
It acts as a wrapper around the async functions, and 
is used for catching any errors
*/

// exporting the wrapper
module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}