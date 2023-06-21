import Joi from 'joi'

export const TRIGGER_NAME_SCHEMA = Joi.string().valid(
  'startOfCombat',
  'active',
  'attack',
  'attacked',
  'attackHit',
  'crit',
  'enemyUseAbility',
  'gainingDebuff',
  'gainedHealth',
  'hitByAttack',
  'instant',
  'rest',
  'takeDamage',
  'takeTurn',
  'targeted',
  'thwart',
  'useAbility',
)