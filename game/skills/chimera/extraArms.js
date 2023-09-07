import { toPct } from '../../utilFunctions.js'

export default function(level){
  return {
    effect: {
      metaEffects: [{
        subject: {
          key: 'attached'
        },
        effectModification: {
          statMultiplier: 1 + level,
        }
      }]
    },
    loadoutModifiers: [{
      loadoutModifierId: 'extraArms',
      subject: {
        key: 'attached'
      },
      orbs: {
        all: toPct(level / 2)
      }
    }]
  }
}