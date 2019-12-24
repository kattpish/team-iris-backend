import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

class Team {}

teamSchema.loadClass(Team)
export default mongoose.model('Team', teamSchema)
