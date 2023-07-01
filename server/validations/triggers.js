import Joi from 'joi'

export const TRIGGER_NAME_SCHEMA = Joi.string().valid(
  'startOfCombat',
  'active',
  'attack',
  'attacked',
  'attackHit',
  'crit',
  'dying',
  'enemyUseAbility',
  'gainingDebuff',
  'gainedHealth',
  'hitByAttack',
  'instant',
  'kill',
  'rest',
  'takeDamage',
  'takeTurn',
  'targeted',
  'thwart',
  'useAbility',
)