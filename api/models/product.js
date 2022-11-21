const mongooes = require('mongoose')

const productSchema = mongooes.Schema({
    _id: mongooes.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true,
    }
})

module.exports = mongooes.model('Product', productSchema)