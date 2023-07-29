import { arrayize, makeEl, msToS, toPct, wrapContent } from '../../../game/utilFunctions.js'
import { conditionsDisplayInfo } from './conditionsDisplayInfo.js'
import EffectDetails from '../components/effectDetails.js'
import { subjectDescription } from '../subjectClientFns.js'
import {
  activeAbility, attachedSkill,
  isAdventurerItem, pluralize,
  refundTime, triggeredAbility,
  wrapStats
} from '../components/common.js'
import { keyword } from './keywordDisplayInfo.js'

const DEFS = {
  swordOfFablesMultiplier: (metaEffect, obj) => {
    return `${metaEffect.effectModification.statMultiplier}x the above stats during boss fights.`
  },
  disabled: () => {
    return null
  },
  phantomCloak: (metaEffect, obj) => {
    return `${attachedSkill(true)}'s ${activeAbility()} becomes ${triggeredAbility('on ' + keyword('thwart'))} (It still has a cooldown)`
  },
  getMad: (metaEffect, obj) => {
    return `Your debuffs also grant you ${wrapStats(metaEffect.effectModification.stats)}.`
  }
}

const ABILITY_MODIFICATION_DEFS = {
  miniatureScroll: amDef => {
    const pct = toPct(amDef.turnRefund)
    let str = `${activeAbility()} refunds ${refundTime(pct)}`
    if(amDef.exclusiveStats){
      str += `, but only benefits from ${wrapStats(amDef.exclusiveStats)}`
    }
    str += '.'
    return wrapContent(str)
  },
  unstableScroll: amDef => {
    return wrapContent(`
    ${activeAbility()} benefits from ${wrapStats(amDef.exclusiveStats)}, but it stuns you for ${msToS(amDef.vars.stunDuration)}s.
    `)
  }
}

export function metaEffectDisplayInfo(metaEffect, obj){
  if(metaEffect.subject?.key === 'self' && obj.izExtreme){
    return null
  }
  if(DEFS[metaEffect.metaEffectId]){
    const def = DEFS[metaEffect.metaEffectId](metaEffect, obj)
    if(!def){
      return null
    }
    return wrapContent(def)
  }
  return derived(metaEffect, obj)
}


function derived(metaEffect, obj){

  const isItem = isAdventurerItem(obj)

  const nodes = []
  let headerContent
  if(metaEffect.conditions){
    headerContent = conditionsDisplayInfo(metaEffect.conditions)
  }else if(metaEffect.subject){
    headerContent = subjectDescription(metaEffect.subject, isItem)
  }

  if(headerContent){
    nodes.push(wrapContent(headerContent, { class: 'meta-effect-header' }))
  }

  const details = new EffectDetails().setObject(metaEffect.effectModification, true)
  if(details.innerHTML){
    nodes.push(details)
  }

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
  if(abilityModification.repetitions){
    chunks.push(`gets repeated ${pluralize('extra time', abilityModification.repetitions)}.`)
  }
  // if(abilityModification.addAction){
  //
  // }

  if(!chunks.length){
    return []
  }

  return [wrapContent(chunks.join(' '))]
}