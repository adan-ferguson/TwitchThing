import Joi from 'joi'

export const TRIGGER_NAME_SCHEMA = Joi.string().valid(
  'startOfCombat',
  'active',
  'attack',
  'attacked',
  'attackHit',
  'enemyUseAbility',
  'gainingDebuff',
  'gainedHealth',
  'hitByAttack',
  'instant',
  'rest',
  'takeTurn',
  'targeted',
  'useAbility',
)