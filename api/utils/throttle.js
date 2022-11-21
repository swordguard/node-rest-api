const debounceForever = (cb, interval) => {
    let timerId

    function wrapper() {
        clearTimeout(timerId)
        const context = this
        const args = arguments
        timerId = setTimeout(() => {
            cb.apply(context, args)
        }, interval)
    }

    return wrapper
}

const throttledViaInterval = (cb, interval) => {
    let prev = 0

    function wrapper() {
        const now = Date.now()
        const context = this
        const args = arguments
        if (now >= prev + interval) {
            cb.apply(context, args)
            prev = Date.now()
        }
    }

    return wrapper
}

module.exports = {
    debounceForever,
    throttledViaInterval
}