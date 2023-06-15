import AdventurerItem from '../../../../game/items/adventurerItem.js'
import { chooseMulti } from '../../../../game/rando.js'
import { gainStatusEffect } from '../../gainStatusEffect.js'

export default function(combat, actor, subject, abilityInstance = null, actionDef = {}){
  const breakableItems = subject.loadoutEffectInstances.filter(lei => {
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
    })
  }
  gainStatusEffect(combat, actor, subject, abilityInstance, statusEffectData)
}