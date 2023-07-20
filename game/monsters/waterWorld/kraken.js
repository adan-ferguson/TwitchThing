export default function(){
  const chillingTouch = {
    name: 'Chilling Touch',
    effect: {
      abilities: [{
        trigger: 'attackHit',
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              polarity: 'debuff',
              name: 'chilled',
              stats: {
                speed: -20
              },
              stacking: 'stack'
            }
          }
        }]
      }]
    }
  }
  const inkCloud = {
    name: 'Ink Cloud',
    effect: {
      abilities: [{
        trigger: 'active',
        cooldown: 15000,
        actions: [{
          applyStatusEffect: {
            targets: 'enemy',
            statusEffect: {
              name: 'Inked',
              polarity: 'debuff',
              stacking: 'stack',
              stats: {
                missChance: '33%'
              }
            }
          }
        }]
      }]
    }
  }
  return {
    baseStats: {
      physPower: '-10%',
      speed: 10,
      hpMax: '+500%'
    },
    items: [chillingTouch, inkCloud]
  }
}