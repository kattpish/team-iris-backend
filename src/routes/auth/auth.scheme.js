import Joi from 'joi'

export const loginInput = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
})
