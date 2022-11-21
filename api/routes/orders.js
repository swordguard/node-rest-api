const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

const {
    orders_get_all,
    orders_create_order,
    orders_get_order,
    orders_update_order,
    orders_delete_order
} = require('../controllers/orders')

router
    .get('/', checkAuth, orders_get_all)
    .post('/', checkAuth, orders_create_order)

router
    .get('/:orderId', checkAuth, orders_get_order)
    .patch('/:orderId', checkAuth, orders_update_order)
    .delete('/:orderId', checkAuth, orders_delete_order)

module.exports = router