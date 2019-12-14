const mongoose = require('mongoose')
const { Schema } = mongoose

const { generateToken } = require('../../lib/token')
const { hash } = require('../../lib/hash')

const schema = new Schema({
  profile: {
    fullName: { type: String },
    thumbnail: {
      type: String,
      default: '/static/images/default_thumbnail.png'
    },
    position: { type: String },
    description: { type: String }
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: { type: Boolean }
},
{
  timestamps: true
})

class Account {
  static findByEmail (email) {
    return this.findOne({ email })
  }

  validatePassword (password) {
    const hashed = hash(password)
    return this.password === hashed
  }

  generateToken () {
    const payload = {
      _id: this._id,
      profile: this.profile
    }
    return generateToken(payload)
  }
}

schema.loadClass(Account)
module.exports = mongoose.model('Account', schema)
