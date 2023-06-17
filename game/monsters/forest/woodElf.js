export default function(){

  const aimedShot = {
    trigger: 'active',
    cooldown: 5000,
    actions: [{
      attack: {
        scaling: {
          physPower: 1.2
        },
        cantDodge: true,
        cantMiss: true
      }
    }]
  }

  return {
    baseStats: {
      speed: 30,
      hpMax: '-10%',
      physPower: '-10%'
    },
    items: [{
      name: 'Aimed Shot',
      effect: {
        abilities: [aimedShot]
      }
    }]
  }
}