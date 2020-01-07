import mongoose from 'mongoose'

const teamResultSchema = new mongoose.Schema({
  team: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
})

const matchSchema = new mongoose.Schema(
  {
    teams: {
      type: [teamResultSchema],
      validate: v => v.length === 2
    }
  },
  {
    timestamps: true
  }
)

class Match {}

matchSchema.loadClass(Match)
export default mongoose.model('Match', matchSchema)
