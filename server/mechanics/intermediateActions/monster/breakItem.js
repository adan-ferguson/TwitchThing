import AdventurerItem from '../../../../game/items/adventurerItem.js'
import { chooseMulti } from '../../../../game/rando.js'

export default function(combat, actor, abilityInstance, actionDef, triggerData){
  const target = combat.getEnemyOf(actor)
  const breakableItems = target.loadoutEffectInstances.filter(lei => {
    return (lei.obj instanceof AdventurerItem) && !lei.disabled
  })
  if(!breakableItems.length){
    return
  }
  const chosen = chooseMulti(breakableItems, actionDef.count ?? 1)
  const statusEffectData = {
    polarity: 'debuff',
    name: 'disarmed',
    persisting: false,
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