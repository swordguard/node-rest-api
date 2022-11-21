const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length > 0) {
            res.status(422).json({
                message: 'email already exists!'
            })
        } else {
            console.log(req.body.password, req.body.email)
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })

                    user.save().then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: 'user created'
                        })
                    }).catch(error => {
                        res.status(500).json({
                            error
                        })
                    })
                }
            })
        }
    })
}

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(users => {
        if (users.length === 0) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if (result) {
                const token = jwt.sign({
                    email: users[0].email,
                    userId: users[0]._id,
                },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1d'
                    }
                )
                return res.status(200).json({
                    message: 'Auth success!',
                    token,
                })
            }
            return res.status(401).json({
                message: 'Auth failed'
            })
        })

    }).catch(error => {
        res.status(500).json({ error })
    })
}

exports.user_get_all = (req, res, next) => {
    User.find().exec().then(users => {
        res.status(200).json({ users })
    }).catch(error => {
        res.status(500).json({ error })
    })
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec().then(result => {
        res.status(201).json({
            message: 'User deleted!'
        })
    }).catch(error => {
        res.status(500).json({ error })
    })
}
