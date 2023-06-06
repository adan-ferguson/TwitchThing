import { makeEl, wrapContent } from '../../../game/utilFunctions.js'
import { subjectDescription } from '../subjectClientFns.js'
import { activeAbility, attachedItem, neighbouringIcon, orbEntries, pluralize } from '../components/common.js'

const DEFS = {
  higherLearning: lm => {
    const inverted = { ...lm.orbs }
    for(let key in inverted){
      inverted[key] *= -1
    }
    return `Your scrolls cost ${orbEntries(inverted)} less.`
  },
  big: () => {
    return `${neighbouringIcon()} Neighbouring item slots must be empty.`
  },
  attachedActive: () => {
    return `${attachedItem()} must have an ${activeAbility()}.`
  }
}

export function loadoutModifierToEl(modifier, isItem){

  const def = DEFS[modifier.loadoutModifierId]?.(modifier)
  if(def){
    return wrapContent(def)
  }

  const nodes = []
  const contentNodes = []
  if(modifier.subjectKey !== 'self'){
    const content = modifier.conditions?.hasTag === 'scroll' ? 'Your scrolls ' : subjectDescription(modifier.subjectKey, isItem)
    nodes.push(wrapContent(content, { class: 'loadout-modifier-header' }))
  }

  let str
  if(modifier.orbs){
    const value = { ...modifier.orbs }
    const advClass = Object.keys(value)[0]
    let moreOrLess = 'more'
    if(value[advClass] < 0){
      value[advClass] *= -1
      moreOrLess = 'less'
    }
    str = `Costs ${orbEntries(value)} ${moreOrLess}`
  }else if(modifier.restrictions){
    const value = modifier.restrictions
    if(value.slot){
      str = `Can only be equipped in slot ${value.slot}`
    }else if(value.empty){
      str = 'Must be empty'
    }else if(value.hasAbility === 'active'){
      str = `Must have an ${activeAbility()}`
    }
  }else if(modifier.levelUp){
    str =`Is upgraded by ${pluralize('level', modifier.levelUp)}`
  }

  if(str){
    contentNodes.push(wrapContent(str))
  }

  if(!contentNodes.length){
    return
  }

  nodes.push(makeEl({ nodes: contentNodes, class: 'loadout-modifier-content' }))
  return makeEl({ nodes })
}