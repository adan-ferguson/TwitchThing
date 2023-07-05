import { simpleAttackAction } from '../../../../game/commonTemplates/simpleAttackAction.js'
import { chooseOne } from '../../../../game/rando.js'

export default function(combat, actor, abilityInstance, def){
  const actions = [simpleAttackAction('magic', def.magicPower)]

  const options = [
    ase({
      base: {
        damageOverTime: {
          damage: {
            scaledNumber: {
              magicPower: def.burn
            }
          }
        }
      }
    }),
    ase({
      stats: {
        speed: -def.speed
      }
    }),
    ase({
      stats: {
        damageDealt: def.weaken + 'x'
      }
    }),
  ]

  if(actor.hpPct <= 0.5){
    actions.push(options.map(o => [o]))
  }else{
    actions.push(chooseOne(options))
  }

  return actions

  function ase(def){
    return {
      applyStatusEffect: {
        targets: 'target',
        statusEffect: {
          ...def,
          polarity: 'debuff',
          stacking: 'stack',
        }
      }
    }
  }
}