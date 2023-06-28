import AdventurerItem from '../../../../game/items/adventurerItem.js'
import { chooseMulti } from '../../../../game/rando.js'
import { gainStatusEffect } from '../../gainStatusEffect.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  const breakableItems = target.loadoutEffectInstances.filter(lei => {
    return (lei.obj instanceof AdventurerItem) && !lei.disabled
  })
  const chosen = chooseMulti(breakableItems, actionDef.count)
  const statusEffectData = {
    polarity: 'debuff',
    name: 'disarmed',
    metaEffects: chosen.map(lei => {
      return {
        metaEffectId: 'disarmed',
        subject: {
          id: lei.uniqueID
        },
        effectModification: {
          exclusiveMods: [{
            disabled: true
          }]
        }
      }
    }),
    ...actionDef.statusEffect
  }
  return {
    applyStatusEffect: {
      targets: 'enemy',
      statusEffect: statusEffectData
    }
  }
}