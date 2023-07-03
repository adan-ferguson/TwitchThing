import { exponentialPercentage } from '../../growthFunctions.js'

export default function(level){
  const def = exponentialPercentage(0.15, level - 1, 0.4)
  return {
    effect: {
      metaEffects: [{
        subject: {
          key: 'self'
        },
        conditions: {
          owner: {
            hpPctBelow: 0.5
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