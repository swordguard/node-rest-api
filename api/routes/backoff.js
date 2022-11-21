const express = require('express')
const router = express.Router()

router.get('/:flag', (req, res, next) => {
    const flag = req.params.flag
    if (flag === 'yesno5') {
        setTimeout(() => {
            res.status(200).json({
                message: 'success after 5000ms delay'
            })
        }, 5000)
    } else
        if (flag && flag.toLowerCase() === 'yes') {
            setTimeout(() => {
                res.status(200).json({
                    message: 'success after 2000ms delay'
                })
            }, 2000)
        } else {
            res.status(200).json({
                message: 'success with no delay'
            })
        }
})

module.exports = router