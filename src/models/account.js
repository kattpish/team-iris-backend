import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { generateToken } from '../utils/token.js'

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    avator: {
      type: String,
      required: true
    },
    team: {
      type: mongoose.SchemaTypes.ObjectId,
      default: null
    },
    position: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    verified: {
      type: Boolean,
      default: null
    },
    permission: {
      type: Number,
      default: 0
    }
  },
  {
    toObject: {
      transform: (doc, ret) => {
        delete ret.password
        return ret
      }
    },
    timestamps: true
  }
)

class Account {
  async validatePassword(password) {
    return bcrypt.compare(password, this.password)
  }

  getPublicFields() {
    return {
      name: this.name,
      avator: this.avator,
      position: this.position,
      email: this.email
    }
  }

  generateToken() {
    const payload = this.getPublicFields()
    return generateToken(payload)
  }
}

accountSchema.loadClass(Account)
export default mongoose.model('Account', accountSchema)
