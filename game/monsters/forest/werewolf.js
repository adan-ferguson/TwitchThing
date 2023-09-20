import { toPct } from '../../utilFunctions.js'

export default function(tier){
  const stats = {
    speed: 25 + tier * 25,
  }
  if(tier > 0){
    stats.physPower = toPct(0.20)
  }
  return {
    baseStats: {
      hpMax: toPct(0.15 + tier * 0.35),
      physPower: '-20%'
    },
    items: [
      {
        name: 'Frenzy',
        effect: {
          abilities: [{
            trigger: 'attackHit',
            actions: [{
              applyStatusEffect: {
                targets: 'self',
                statusEffect: {
                  name: 'frenzy',
                  polarity: 'buff',
                  stacking: 'stack',
                  stats
                }
              }
            }]
          }]
        }
      }
    ]
  }
}