import Joi from 'joi'

export const createTeamInput = Joi.object({
  name: Joi.string().required(),
  coach: Joi.string().required()
})

export const updateTeamInput = Joi.object({
  name: Joi.string(),
  coach: Joi.string()
})
