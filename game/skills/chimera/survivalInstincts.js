import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const def = exponentialPercentage(0.2, level - 1, 0.4)
  return {
    effect: {
      metaEffects: [{
        subject: {
          key: 'self'
        },
        conditions: {
          owner: {
            hpPctBelow: 0.65
          }
        },
        effectModification: {
          stats: {
            physDef: def,
            magicDef: def
          }
        }
      }]
    }
  }
}