import { arrayize, makeEl, wrapContent } from '../../../game/utilFunctions.js'
import { conditionsDisplayInfo } from './conditionsDisplayInfo.js'
import EffectDetails from '../components/effectDetails.js'
import { subjectDescription } from '../subjectClientFns.js'
import { isAdventurerItem } from '../components/common.js'

const DEFS = {
  swordOfFablesMultiplier: (metaEffect, obj) => {
    return `${metaEffect.effectModification.statMultiplier}x the above stats during boss fights.`
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
  }else {
    headerContent = subjectDescription(metaEffect.subject, isItem)
  }

  nodes.push(wrapContent(headerContent, { class: 'meta-effect-header' }))
  nodes.push(new EffectDetails().setObject(metaEffect.effectModification, true))

  if(!nodes.length){
    return
  }

  return makeEl({ nodes, class: 'meta-effect' })
}