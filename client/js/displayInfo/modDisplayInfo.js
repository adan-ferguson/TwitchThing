import _ from 'lodash'

const DEFS = {
  sneakAttack: mod => {
    return {
      description: 'Act immediately at start of combat.'
    }
  },
  ignoreDef: mod => {
    const type = _.isString(mod.ignoreDef) ? mod.ignoreDef : ''
    return {
      description: ['This ignores', type, 'defense.'].filter(c => c).join(' '),
      metaDescription: ['ignores', type, 'defense.'].filter(c => c).join(' ')
    }
  }
}
export function modDisplayInfo(mod){
  for(let key in mod){
    if(DEFS[key]){
      return DEFS[key](mod)
    }
  }
}