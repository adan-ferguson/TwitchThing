import attackAction from '../actions/attackAction.js'
import gainHealthAction from '../actions/gainHealthAction.js'

export default function(def){
  return {
    name: 'Bite',
    abilities: {
      active: {
        initialCooldown: 10000,
        description: 'Attack for [physScaling1.5] damage. Heal for 50% of the damage dealt.',
        actions: [
          attackAction({
            damagePct: 1.5
          }),
          ({ results }) => {
            const data = results[0].data
            if (data){
              return gainHealthAction({
                flat: data.damageDistribution.hp * 0.5
              })
            }
          }
        ]
      }
    },
    ...def
  }
}