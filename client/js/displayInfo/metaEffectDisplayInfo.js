import { arrayize, makeEl, toPct, wrapContent } from '../../../game/utilFunctions.js'
import { conditionsDisplayInfo } from './conditionsDisplayInfo.js'
import EffectDetails from '../components/effectDetails.js'
import { subjectDescription } from '../subjectClientFns.js'
import {
  activeAbility,
  isAdventurerItem,
  refundTime,
  wrapStats
} from '../components/common.js'

const DEFS = {
  swordOfFablesMultiplier: (metaEffect, obj) => {
    return `${metaEffect.effectModification.statMultiplier}x the above stats during boss fights.`
  }
}

const ABILITY_MODIFICATION_DEFS = {
  miniatureScroll: metaEffect => {
    const pct = toPct(metaEffect.turnRefund)
    return wrapContent(`
    ${activeAbility()} refunds ${refundTime(pct)}, 
    but only benefits from ${wrapStats(metaEffect.exclusiveStats)}.
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
  const def = ABILITY_MODIFICATION_DEFS[abilityModification.abilityModificationId]?.(abilityModification)
  if(def){
    return arrayize(def)
  }

  const chunks = []

  if(abilityModification.trigger === 'active'){
    chunks.push(activeAbility(), 'ability')
  }
  if(abilityModification.exclusiveStats){
    chunks.push('benefits from', wrapStats(abilityModification.exclusiveStats))
  }

  if(!chunks.length){
    return []
  }

  return [wrapContent(chunks.join(' '))]
}