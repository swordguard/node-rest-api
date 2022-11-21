const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('-__v')
        .populate('product', 'name')
        .exec().then(docs => res.status(200).json(docs)).catch()
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(result => {
            if (!result) {
                res.status(404).json({
                    message: 'Not found!!!'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            })

            order.save().then(result => {
                console.log(result)
                res.status(201).json(result)
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'not found',
                error: err
            })
        })

}

exports.orders_get_order = (req, res, next) => {
    const id = req.params.orderId
    Order.findById(id).exec().then(order => {
        if (!order) {
            res.status(404).json({
                message: 'Not found!!!'
            })
        } else {
            res.status(200).json({
                order,
            })
        }

    }).catch(error => {
        res.status(500).json({
            error,
        })
    })
}

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.orderId
    Order.deleteOne({ _id: id }).exec().then(result => {
        res.status(201).json(result)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_update_order = (req, res, next) => {
    const id = req.params.orderId

    res.status(200).json({
        message: 'updated order ' + id
    })
}