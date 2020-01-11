import Joi from 'joi'

export const createMatchInput = Joi.object({
  leagueId: Joi.number().required(),
  result: Joi.array()
    .items(
      Joi.object({
        teamId: Joi.number().required(),
        score: Joi.number().required()
      })
    )
    .length(2)
})
