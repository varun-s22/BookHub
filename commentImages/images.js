const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudName = process.env.CLOUD_NAME
const cloudApiKey = process.env.CLOUD_API_KEY
const clousApiSecret = process.env.CLOUD_API_SECRET

cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: clousApiSecret
})


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "BookHub",
        allowedFormats: ["jpeg", "jpg", "png"]
    }
})
module.exports = {
    cloudinary,
    storage
}