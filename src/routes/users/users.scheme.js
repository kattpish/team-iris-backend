import Joi from 'joi'

export const updateUserInput = Joi.object({
  name: Joi.string(),
  position: Joi.string(),
  team: Joi.string(),
  email: Joi.string(),
  password: Joi.string().min(6),
  permission: Joi.number(),
  verified: Joi.boolean()
})

export const createUserInput = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  team: Joi.string(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
})
