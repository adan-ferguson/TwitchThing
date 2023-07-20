export default function(){
  return {
    baseStats: {
      hpMax: '+150%',
      speed: 70,
      physPower: '-10%',
    },
    items: [
      {
        name: 'Grenade Launcher',
        effect: {
          stats: {
            critChance: 0.2,
            critDamage: '+100%'
          }
        }
      },
      {
        name: 'Cybernetic Armor',
        effect: {
          effectId: 'behemothCarapace',
          stats: {
            damageThreshold: 0.05
          }
        }
      }
    ]
  }
}