const crypto = require('crypto')

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex')
}

exports.hash = hash