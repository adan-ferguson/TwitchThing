import { SUBJECT_KEYS } from '../adventurer/subjectKeys.js'

const ABILITY_KEYS = ['physAttackHit']

const ACTION_VALIDATION = {
  statusEffect: {
    type: {
      name: { type: 'string', required: true },
      vars: { type: 'object' }
    }
  }
}

const ABILITY_VALIDATION = {
  actions: {
    type: 'array',
    arrayOf: {
      type: ACTION_VALIDATION
    }
  },
  conditions: {
    type: {
      source: {
        type: SUBJECT_KEYS
      }
    }
  }
}

export const ADVENTURER_EFFECT_VALIDATION = {
  abilities: {
    type: 'object',
    validKeys: ABILITY_KEYS,
    validValue: {
      type: ABILITY_VALIDATION
    }
  },
  stats: {
    type: 'object'
  }
}