import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const ret = {
    effect: {
      mods: [{
        magicAttack: true
      }]
    },
  }
  if(level > 1){
    ret.effect.stats = {
      magicPower: wrappedPct(30 * level - 30),
    }
  }
  return ret
}