import attackAction from '../actions/attackAction.js'
import gainHealthAction from '../actions/gainHealthAction.js'

export default function(){
  return {
    name: 'Bite',
    abilities: {
      active: {
        initialCooldown: 10000,
        description: 'Attack for [P1.5] damage. Heal for 50% of the damage dealt.',
        actions: [
          attackAction({
            damagePct: 1.5
          }),
          (combat, owner, prevResults) => {
            const data = prevResults[0].data
            if (data){
              return gainHealthAction({
                flat: data.damageDistribution.hp * 0.5
              })
            }
          }
        ]
      }
    }
  }
}