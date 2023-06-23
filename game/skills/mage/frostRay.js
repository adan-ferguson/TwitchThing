import { onHit } from '../../commonTemplates/onHit.js'

export default function(level){
  const cooldown = 9000 + level * 3000
  const speed = -20 - level * 20
  const magicPower = 0.5 + 0.2 * level
  return {
    effect: {
      abilities: [
        {
          trigger: 'active',
          cooldown,
          actions: [{
            attack: {
              scaling: {
                magicPower
              },
              damageType: 'magic',
            }
          },{
            applyStatusEffect: {
              targets: 'target',
              statusEffect: {
                base: {
                  slowed: {
                    speed
                  }
                },
                name: 'chilled'
              }
            }
          }]
        }
      ]
    }
  }
}