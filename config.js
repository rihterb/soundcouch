module.exports = {
    ServerPort: process.env["PORT"] || 3000,
    DatabaseUrl: process.env["MONGODB_URI"] || 'mongodb://richter:R123456@ds037601.mlab.com:37601/heroku_g9w20948',
    cloudinary: {
        cloud_name: process.env["CLOUDINARY_NAME"] || 'ddxbmradh',
        api_key: process.env["CLOUDINARY_API_KEY"] || '172756415977189',
        api_secret: process.env["CLOUDINARY_API_SECRET"] || 'FNNmPnrUCCGEQ-qECkkPKWq9V6o'
    }
};