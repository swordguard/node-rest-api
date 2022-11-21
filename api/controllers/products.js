const { json } = require('body-parser')
const mongoose = require('mongoose')
const Product = require('../models/product')
const {
    createProduct,
    deleteProduct
} = require('../services/ProductService')

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('-__v')
        .exec().then(docs => {
            const response = {
                count: docs.length,
                products: docs
            }
            res.status(200).json(response)
        }).catch(err => {

            res.status(500).json({
                error: err
            })
        })
}

exports.products_create_product = async (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    // product.save().then(result => {
    //     console.log(result)
    //     res.status(200).json({
    //         createdProduct: product
    //     })
    // }).catch(err => {
    //     console.log(err)
    //     res.status(500).json({ error: err })
    // })
    try {
        const result = await createProduct(product)
        res.status(201).json({
            data: result
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            console.log('From mongodb', doc)
            if (doc) {
                res.status(200).json(doc)

            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

}

exports.products_delete_product = async (req, res, next) => {
    const id = req.params.productId

    try {
        const result = await deleteProduct(id)
        if (!result) {
            res.status(404).json({ message: 'Invalid entry' })
        } else {
            res.status(200).json({ data: result })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.products_update_product = async (req, res, next) => {
    const id = req.params.productId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    try {
        const result = await Product.findByIdAndUpdate(id, updateOps)
        if (!result) {
            res.status(404).json({ message: 'Invalid entry' })
        } else {
            res.status(201).json({
                data: {
                    ...result._doc,
                    ...updateOps
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}
