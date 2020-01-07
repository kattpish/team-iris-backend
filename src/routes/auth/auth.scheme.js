import Joi from 'joi'

export const registerInput = Joi.object({
  name: Joi.string().required(),
  position: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  profileImg: Joi.string()
})

export const loginInput = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
})
