import Joi from 'joi'

export const createLeagueInput = Joi.object({
  name: Joi.string().required(),
  date: Joi.date(),
  location: Joi.string() // 리그 장소는 안 변할까??
})
