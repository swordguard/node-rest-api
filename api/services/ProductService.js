const Product = require('../models/product')

exports.getAllProducts = () => {
    return Product.find()
}

exports.getProductById = (id) => {
    return Product.findById(id)
}

exports.createProduct = (product) => {
    return Product.create(product)
}

exports.updateProduct = async (id, product) => {
    return await Product.findByIdAndUpdate(id, product)
}

exports.deleteProduct = (id) => {
    return Product.findByIdAndDelete(id)
}
