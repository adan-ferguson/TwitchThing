import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'

export default function(tier){

  const magicBlast = {
    trigger: 'active',
    initialCooldown: 4000,
    cooldown: 8000,
    actions: [{
      attack: {
        scaling: {
          magicPower: 0.5
        },
        hits: tier * 3 + 2,
        damageType: 'magic'
      }
    }]
  }

  return {
    baseStats: {
      speed: 55,
      hpMax: '-50%',
      physPower: '-40%',
      magicPower: '+30%'
    },
    items: [
      flutteringMonsterItem,
      {
        name: 'Magic Barrage',
        effect: {
          abilities: [magicBlast]
        }
      }
    ]
  }
}