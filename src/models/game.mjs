import mongoose from 'mongoose'

const teamResultSchema = new mongoose.Schema({
  team: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  win: {
    type: Boolean,
    required: true
  }
})

const gameSchema = new mongoose.Schema(
  {
    team1: {
      type: teamResultSchema,
      required: true
    },
    team2: {
      type: teamResultSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
)

class Game {}

gameSchema.loadClass(Game)
export default mongoose.model('Game', gameSchema)
