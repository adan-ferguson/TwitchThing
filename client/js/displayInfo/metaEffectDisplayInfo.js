import { arrayize, makeEl, toPct, wrapContent } from '../../../game/utilFunctions.js'
import { conditionsDisplayInfo } from './conditionsDisplayInfo.js'
import EffectDetails from '../components/effectDetails.js'
import { subjectDescription } from '../subjectClientFns.js'
import { isAdventurerItem, refundTime, scalingWrap } from '../components/common.js'

const DEFS = {
  swordOfFablesMultiplier: (metaEffect, obj) => {
    return `${metaEffect.effectModification.statMultiplier}x the above stats during boss fights.`
  }
}

const ABILITY_MODIFICATION_DEFS = {
  miniatureScroll: metaEffect => {
    const pct = toPct(1 - metaEffect.turnTime)
    return wrapContent(`
    Attached active refunds ${refundTime(pct)}, 
    but the ability only benefits from ${scalingWrap('physPower', metaEffect.exclusiveStats.physPower)}
    and ${scalingWrap('magicPower', metaEffect.exclusiveStats.magicPower)}.
    `)
  }
}

export function metaEffectDisplayInfo(metaEffect, obj){
  if(DEFS[metaEffect.metaEffectId]){
    return wrapContent(DEFS[metaEffect.metaEffectId](metaEffect, obj))
  }
  return derived(metaEffect, obj)
}


function derived(metaEffect, obj){

  const isItem = isAdventurerItem(obj)

  const nodes = []
  let headerContent
  if(metaEffect.conditions){
    headerContent = conditionsDisplayInfo(metaEffect.conditions)
  }else{
    headerContent = subjectDescription(metaEffect.subjectKey, isItem)
  }

  nodes.push(wrapContent(headerContent, { class: 'meta-effect-header' }))
  nodes.push(new EffectDetails().setObject(metaEffect.effectModification, true))

  if(metaEffect.effectModification.abilityModification){
    nodes.push(...derivedAbilityModification(metaEffect.effectModification.abilityModification))
  }

  if(!nodes.length){
    return
  }

  return makeEl({ nodes, class: 'meta-effect' })
}

function derivedAbilityModification(abilityModification){
  console.log('dam')
  const def = ABILITY_MODIFICATION_DEFS[abilityModification.abilityModificationId]?.(abilityModification)
  return arrayize(def ?? null)
}