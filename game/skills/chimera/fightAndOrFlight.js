import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const speed = level * 25 + 25
  const physPower = wrappedPct(50 + 50 * level)
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
            physPower,
            speed
          }
        }
      }]
    },
    displayName: 'Fight and/or Flight'
  }
}