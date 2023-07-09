import { wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const speed = level * 40 + 20
  const physPower = wrappedPct(speed)
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