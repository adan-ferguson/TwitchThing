import { simpleAttackAction } from '../../../../game/commonMechanics/simpleAttackAction.js'
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
            },
          },
          damageType: 'magic'
        }
      },
      stackingId: 'dbBurn',
      name: 'Burned'
    }),
    ase({
      stats: {
        speed: -def.slow
      },
      stackingId: 'dbChill',
      name: 'Chilled'
    }),
    ase({
      stats: {
        physPower: def.weaken,
        magicPower: def.weaken,
      },
      stackingId: 'dbWeak',
      name: 'Weakened'
    }),
  ]

  if(actor.hpPct < 0.65){
    actions.push(...options)
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