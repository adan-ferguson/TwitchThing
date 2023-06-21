import { onHit } from '../../commonTemplates/onHit.js'

export default function(level){
  const physPower = 0.8 + level * 0.2
  const stunBase = 1000 + level * 1000
  const scaledNumber = {
    flat: stunBase,
    effectStats: {
      subjectKey: 'attached',
      stat: 'block',
      base: stunBase * 2
    }
  }
  const applyStun = {
    applyStatusEffect: {
      targets: 'target',
      statusEffect: {
        base: {
          stunned: {
            duration: {
              scaledNumber
            }
          }
        }
      }
    }
  }
  return {
    effect: {
      abilities: [{
        abilityId: 'shieldBash',
        trigger: 'active',
        cooldown: 10000 + 2000 * level,
        vars: {
          physPower,
          stunBase,
          scaledNumber
        },
        actions: [{
          attack: {
            damageType: 'phys',
            scaling: {
              physPower,
            },
          }
        }]
      }, onHit(applyStun)]
    }
  }
}