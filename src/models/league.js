import mongoose from 'mongoose'

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  matches: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      required: true
    }
  ]
})

class League {}

leagueSchema.loadClass(League)
export default mongoose.model('league', leagueSchema)
