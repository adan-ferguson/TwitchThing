import Joi from 'joi'

export const SUBJECT_KEYS = ['self', 'attached', 'neighbouring', 'allItems', 'aboveNeighbour', 'belowNeighbour', 'all']

export const SUBJECT_KEYS_SCHEMA = Joi.string().valid(...SUBJECT_KEYS)
