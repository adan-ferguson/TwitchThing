export default function(tier){

  const aimedShot = {
    trigger: 'active',
    cooldown: 5000,
    actions: [{
      attack: {
        scaling: {
          physPower: 1.5
        },
        cantDodge: true,
        cantMiss: true
      }
    }]
  }

  return {
    baseStats: {
      speed: 30 + tier * 120,
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