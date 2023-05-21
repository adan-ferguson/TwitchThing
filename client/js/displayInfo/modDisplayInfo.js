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
      metaDescription: ['ignores', type, 'defense.'].filter(c => c).join(' ')
    }
  },
  bossFightStatMultiplier: mod => {
    return {
      description: `These stats are increased ${mod}x during boss fights.`
    }
  }
}
export function modDisplayInfo(mod){
  for(let key in mod){
    if(DEFS[key]){
      return DEFS[key](mod[key])
    }
  }
  return null
}