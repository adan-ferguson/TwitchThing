import { isAdventurerItem, wrapStat } from '../components/common.js'
import { modDisplayInfo } from './modDisplayInfo.js'
import { wrapContent } from '../../../game/utilFunctions.js'
import { subjectDescription } from '../../../game/subjectFns.js'

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
  const html = derived(subjectKey, metaEffect, obj)
  if(!html){
    return null
  }
  return wrapContent(html)
}


function derived(subjectKey, metaEffect, obj){

  const isItem = isAdventurerItem(obj)
  const chunks = []
  chunks.push(subjectDescription(subjectKey, isItem))

  const subchunks = []
  if(metaEffect.exclusiveStats){
    let statHtml = 'benefits from '
    for(let statKey in metaEffect.exclusiveStats){
      statHtml += wrapStat(statKey, metaEffect.exclusiveStats[statKey])
    }
    subchunks.push(statHtml)
  }
  if(metaEffect.exclusiveMods){
    metaEffect.exclusiveMods.forEach(mod => {
      const mdi = modDisplayInfo(mod)
      if(mdi.metaDescription){
        subchunks.push(mdi.metaDescription)
      }
    })
  }
  if(subchunks.length){
    chunks.push(subchunks.join(' and '))
  }

  return chunks.length ? wrapContent(chunks.join(' ')) : null
}