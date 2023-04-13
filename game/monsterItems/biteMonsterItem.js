import attackAction from '../actions/actionDefs/common/attack.js'
import gainHealthAction from '../actions/actionDefs/common/gainHealthAction.js'

export default function(def){
  return {
    name: 'Bite',
    abilities: {
      active: {
        initialCooldown: 8000,
        description: 'Attack for [physScaling1.5] damage. Heal for 50% of the damage dealt.',
        actions: [
          attackAction({
            damagePct: 1.5
          }),
          ({ results }) => {
            const data = results[0].data
            if (data){
              return gainHealthAction({
                scaling: { flat: data.damageDistribution.hp * 0.5 }
              })
            }
          }
        ]
      }
    },
    ...def
  }
}