import Joi from 'joi'

export const updateUserInput = Joi.object({
  name: Joi.string(),
  position: Joi.string(),
  email: Joi.string(),
  password: Joi.string().min(6),
  permission: Joi.number()
})
