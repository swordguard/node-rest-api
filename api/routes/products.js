const express = require('express')
const router = express.Router()

const multer = require('multer')
const checkAuth = require('../middleware/checkAuth')

const {
    products_get_all,
    products_create_product,
    products_get_product,
    products_update_product,
    products_delete_product
} = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const fileType = ['image/jpeg', 'image/jpg', 'image/png']

    if (!fileType.includes(file.mimetype)) {
        cb(new Error("file type not allowed"), false)
    } else {
        cb(null, true)
    }

    // reject a file
    // cb(null, false)
}

const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024
    },
    fileFilter
})

// jay-sun71503
// jay-sun71503 used in MongoDB

router
    .get('/', products_get_all)
    .post('/', checkAuth, upload.single('productImage'), products_create_product)

router
    .get('/:productId', products_get_product)
    .patch('/:productId', checkAuth, products_update_product)
    .delete('/:productId', checkAuth, products_delete_product)

module.exports = router