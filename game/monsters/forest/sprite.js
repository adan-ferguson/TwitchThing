import flutteringMonsterItem from '../../commonMechanics/flutteringMonsterItem.js'

export default function(){

  const magicBlast = {
    trigger: 'active',
    initialCooldown: 4000,
    cooldown: 8000,
    actions: [{
      attack: {
        scaling: {
          magicPower: 1
        },
        damageType: 'magic'
      }
    }]
  }

  return {
    baseStats: {
      speed: 55,
      hpMax: '-50%',
      physPower: '-40%',
      magicPower: '+40%'
    },
    items: [
      flutteringMonsterItem,
      {
        name: 'Magic Blast',
        effect: {
          abilities: [magicBlast]
        }
      }
    ]
  }
}