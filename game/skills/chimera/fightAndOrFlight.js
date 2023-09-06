import { geometricProgression, wrappedPct } from '../../growthFunctions.js'

export default function(level){
  const speed = level * 25 + 25
  const physPower = wrappedPct(25 + geometricProgression(0.20, level, 25, 5))
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
            physPower,
            speed
          }
        }
      }]
    },
    displayName: 'Fight and/or Flight'
  }
}