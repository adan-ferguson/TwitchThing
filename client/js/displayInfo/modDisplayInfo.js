import _ from 'lodash'

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
      metaDescription: ['Ignores', type, 'defense'].filter(c => c).join(' ')
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
      description: 'Magic attacks can crit.'
    }
  },
  goldOnly: () => {
    return {
      description: 'Chests found will only contain gold.'
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