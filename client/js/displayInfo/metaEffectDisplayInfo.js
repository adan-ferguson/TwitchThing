import { isAdventurerItem, wrapStat } from '../components/common.js'
import { modDisplayInfo } from './modDisplayInfo.js'
import { arrayize, makeEl, wrapContent } from '../../../game/utilFunctions.js'
import { subjectDescription } from '../subjectClientFns.js'
import { StatsDisplayStyle } from './statsDisplayInfo.js'
import StatsList from '../components/stats/statsList.js'
import Stats from '../../../game/stats/stats.js'
import { conditionsDisplayInfo } from './conditionsDisplayInfo.js'
import EffectDetails from '../components/effectDetails.js'

const DEFS = {
  swordOfFablesMultiplier: (metaEffect, obj) => {
    if(obj.effect?.appliedMetaEffects?.find(ame => ame.metaEffectId === 'swordOfFablesMultiplier')){
      return 'AAAAAAAAAH!'
    }
    return `${metaEffect.statMultiplier}x the above stats during boss fights.`
  }
}

export function metaEffectDisplayInfo(subjectKey, metaEffect, obj){
  if(DEFS[metaEffect.metaEffectId]){
    return wrapContent(DEFS[metaEffect.metaEffectId](metaEffect, obj))
  }
  return derived(subjectKey, metaEffect, obj)
}


function derived(subjectKey, metaEffect, obj){

  debugger
  const isItem = isAdventurerItem(obj)

  const nodes = []
  if(metaEffect.conditions){
    nodes.push(...arrayize(conditionsDisplayInfo(metaEffect.conditions)))
  }

  nodes.push(new EffectDetails().setObject(metaEffect))

  if(!nodes.length){
    return
  }

  return makeEl({ nodes })
}