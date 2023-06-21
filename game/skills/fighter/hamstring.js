import { onHit } from '../../commonTemplates/onHit.js'

export default function(level){
  const physPower = 1.2 + level * 0.2
  const speed = -15 - level * 10
  const hamstrung = {
    applyStatusEffect: {
      targets: 'target',
      statusEffect: {
        base: {
          slowed: {
            speed
          }
        },
        name: 'hamstrung',
      }
    }
  }
  return {
    effect: {
      abilities: [
        {
          trigger: 'active',
          cooldown: 12000,
          actions: [{
            attack: {
              scaling: {
                physPower
              },
            }
          }]
        },
        onHit(hamstrung)]
    }
  }
}