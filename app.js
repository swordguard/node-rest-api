const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { debounceForever, throttledViaInterval } = require('./api/utils/throttle')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
const backoffRoutes = require('./api/routes/backoff')

const conn_str = `mongodb+srv://${process.env.MONGO_ATLAS_UN}:${process.env.MONGO_ATLAS_PW}@node-rest-shop.ehwghoi.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(conn_str,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if (err) {
            console.log("error in connection");
        } else {
            console.log("mongodb is connected");
        }
    })

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    // res.header('Access-Control-Allow-Header', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-with, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        res.status(200).json({})
    }

    next()
})

// add routes here
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

app.use('/back-off', backoffRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found !!!');
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
})

const sayHello = (args) => {
    console.log('Hello there!', args)
}

const debouncedSayHello = debounceForever(sayHello, 500)

const throttledSayHello = throttledViaInterval(sayHello, 1000)

// console.log(0)
// debouncedSayHello()
// console.log(1)
// debouncedSayHello()
// console.log(2)
// debouncedSayHello()
// console.log(3)
// setTimeout(() => {
//     debouncedSayHello()
// })
// console.log(4)
// setTimeout(() => {
//     debouncedSayHello()
// }, 510)

// throttledSayHello(1)
// throttledSayHello(2)
// throttledSayHello(3)
// throttledSayHello(4)
// throttledSayHello(5)

// setTimeout(() => {
//     throttledSayHello(1400)
// }, 1400)
// setTimeout(() => {
//     throttledSayHello(1500)
// }, 1500)
// setTimeout(() => {
//     throttledSayHello(2600)
// }, 2600)
// setTimeout(() => {
//     throttledSayHello(2900)
// }, 2900)
// setTimeout(() => {
//     throttledSayHello(3700)
// }, 3700)
// setTimeout(() => {
//     throttledSayHello(4950)
// }, 4950)

async function retryPromise(promise, nthTry, delayTime) {
    try {
        // try to resolve the promise
        const data = await promise;
        // if resolved simply return the result back to the caller
        return data;
    } catch (e) {
        console.log('retrying', nthTry, 'time');
        // if the promise fails and we are down to 1 try we reject
        if (nthTry === 1) {
            return Promise.reject(e);
        }
        // if the promise fails and the current try is not equal to 1
        // we call this function again from itself but this time
        // we reduce the no. of tries by one
        // so that eventually we reach to "1 try left" where we know we have to stop and reject
        await waitFor(delayTime);

        // we return whatever is the result of calling the same function
        return retryPromise(promise, nthTry - 1, delayTime);
    }
}

function retryPromise2(promise, nthTry, delayTime) {
    return promise.then((result) => {
        console.log(result)
    })
        .catch((err) => {
            console.log(err, nthTry)
            if (nthTry > 0) {
                retryPromise2(promise, nthTry - 1, delayTime)
            }
        });

}

function waitFor(millSeconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, millSeconds);
    });
}

let hasFailed = false
const getUser = new Promise((res, rej) => {
    if (!hasFailed) {
        hasFailed = true
        rej('getUser has failed')
    } else {
        res('resolved')
    }
})

const retryGetUser = () => retryPromise2(getUser, 3, 2000)

retryGetUser()

module.exports = app