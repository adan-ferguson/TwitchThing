import _ from 'lodash'
import { describeStat, triggeredAbility } from '../components/common.js'

const DEFS = {
  sneakAttack: mod => {
    return {
      description: 'Act immediately at start of combat.'
    }
  },
  ignoreDef: mod => {
    const type = _.isString(mod) ? mod : ''
    return {
      abilityDescription: ['This ignores', type, 'defense.'].filter(c => c).join(' '),
      metaDescription: ['Ignores', type, 'defense.'].filter(c => c).join(' ')
    }
  },
  bossFightStatMultiplier: mod => {
    return {
      description: `These stats are increased ${mod}x during boss fights.`
    }
  },
  autoCritAgainst: () => {
    return {
      description: 'Attacks against you always crit.'
    }
  },
  freezeActionBar: () => {
    return {
      description: 'Action bar does not fill.'
    }
  },
  silenced: () => {
    return {
      description: 'Silenced'
    }
  },
  magicAttack: () => {
    return {
      description: 'Basic attacks use magic power.'
    }
  },
  disabled: () => {
    return null
  },
  noBasicAttack: () => {
    return {
      description: 'Can\'t basic attack.'
    }
  },
  magicCrit: () => {
    return {
      description: 'Your magic attacks can crit.'
    }
  },
  goldOnly: () => {
    return {
      description: 'Enemies don\'t drop chests.'
    }
  },
  noAttack: () => {
    return {
      description: 'Can\'t attack.'
    }
  },
  cantDie: () => {
    return {
      description: 'Can\'t die!'
    }
  },
  glitchedCooldowns: () => {
    return {
      description: `Your ${describeStat('cooldownMultiplier')} stat also affects ${triggeredAbility('triggered abilities')} & buffs/debuffs. Probably stupid.`
    }
  },
  stayHungry: () => {
    return {
      description: 'When resting, use only 0.5 food, but restore only 50% missing health.'
    }
  }
}
export function modDisplayInfo(mod){
  for(let key in mod){
    if(DEFS[key]){
      return DEFS[key](mod[key]) ?? {}
    }
  }
  throw { message: 'Mod undefined', mod }
}