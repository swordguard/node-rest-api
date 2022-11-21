const mongooes = require('mongoose')

const orderSchema = mongooes.Schema({
    _id: mongooes.Schema.Types.ObjectId,
    product: {
        type: mongooes.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
})

module.exports = mongooes.model('Order', orderSchema)