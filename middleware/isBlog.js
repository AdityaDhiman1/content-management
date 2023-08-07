const BlogSetting = require('../models/blogSettingModel')


const isBlog = async (req, res, next) => {
    try {
        const blogsetting = await BlogSetting.find({})
        if (blogsetting.length == 0 && req.originalUrl != '/blog-setup') {
            res.redirect('/blog-setup')
        }
        else {
            next();
        }
    } catch (error) {
        console.log("isblog", error.message)

    }
}

module.exports = { isBlog }