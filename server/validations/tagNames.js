import Joi from 'joi'

export const TAG_NAME_SCHEMA = Joi.string().valid(
  'scroll',
  'terribleCurse',
)

export const TAGS_LIST_SCHEMA = Joi.array().items(TAG_NAME_SCHEMA)