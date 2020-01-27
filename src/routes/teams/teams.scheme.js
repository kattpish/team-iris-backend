import Joi from 'joi'

export const createTeamInput = Joi.object({
  name: Joi.string().required()
})

export const updateTeamInput = Joi.object({
  name: Joi.string()
})
