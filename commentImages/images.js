/* 
cloudinary stores images attached with comment
instead of saving images in our database
we upload them on cloudinary server, and stores the link of the image
in our database
*/
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// loads the data
const cloudName = process.env.CLOUD_NAME
const cloudApiKey = process.env.CLOUD_API_KEY
const clousApiSecret = process.env.CLOUD_API_SECRET

// connects with cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: clousApiSecret
})

// creates storage for our images in the server
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "BookHub",
        allowedFormats: ["jpeg", "jpg", "png"]
    }
})

// exports these to other files
module.exports = {
    cloudinary,
    storage
}