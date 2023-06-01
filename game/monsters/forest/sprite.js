import flutteringMonsterItem from '../../monsterItems/flutteringMonsterItem.js'

export default function(){

  const magicBlast = {
    trigger: { active: true },
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
      speed: 50,
      hpMax: '-50%',
      physPower: '-40%',
      magicPower: '+40%'
    },
    items: [
      flutteringMonsterItem,
      {
        name: 'Magic Blast',
        effect: {
          tags: ['magic'],
          abilities: [magicBlast]
        }
      }
    ]
  }
}