const mongoose = require('mongoose')
const { Schema } = mongoose
const crypto = require('crypto')

const { generateToken } = require('../../lib/token')

function hash(password) {
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex')
}

const Profile = new Schema({
    fullName: String,
    thumbnail: {
        type: String,
        default: '/static/images/default_thumbnail.png'
    },
    position: String,
    description: String
})

const Account = new Schema({
    profile: [Profile],
    email: String,  
    password: String,
    verified: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

Account.statics.findByEmail = function(email) {
    return this.findOne({ email }).exec()
}

Account.statics.localRegister = function({ email, password }) {
    const account = new this({
        email,
        password: hash(password)
    })

    return account.save()
}

Account.methods.validatePassword = function(password) {
    const hashed = hash(password)
    return this.password === hashed
}

Account.methods.generateToken = function() {
    const payload = {
        _id: this._id,
        profile: this.profile
    }

    return generateToken(payload)
}

module.exports = mongoose.model('Account', Account)