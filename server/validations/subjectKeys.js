import Joi from 'joi'

export const SUBJECT_KEYS = [
  'self',
  'attached',
  'neighbouring',
  'allItems',
  'aboveNeighbour',
  'belowNeighbour',
  'all'
]

export const SUBJECT_KEYS_SCHEMA = Joi.alternatives().try(
  Joi.string().valid(...SUBJECT_KEYS),
  Joi.object({
    row: Joi.number().integer().min(0).max(7).required(),
    col: Joi.number().integer().min(0).max(1)
  })
)
