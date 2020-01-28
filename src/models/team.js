import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    default: null
  },
  coach: {
    type: String,
    default: ''
  }
})

class Team {}

teamSchema.loadClass(Team)
export default mongoose.model('Team', teamSchema)
