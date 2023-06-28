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
        initialCooldown: 10000,
        uses: 1,
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
      physPower: '-25%',
      speed: 10,
      hpMax: '+500%'
    },
    items: [chillingTouch, inkCloud]
  }
}