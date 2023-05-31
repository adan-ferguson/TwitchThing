import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const ret = {
    effect: {
      mods: [{
        magicAttack: true
      }]
    },
    displayName: 'Wand',
    orbs: level * 1
  }
  if(level > 1){
    ret.effect.stats = {
      magicPower: wrappedPct(10 * level),
    }
  }
  return ret
}