import { makeEl, wrapContent } from '../../../game/utilFunctions.js'
import { subjectDescription } from '../subjectClientFns.js'
import {
  activeAbility,
  attachedItem, attachedSkill,
  describeStat,
  neighbouringIcon,
  orbEntries,
  pluralize
} from '../components/common.js'

const DEFS = {
  higherLearning: lm => {
    const inverted = { ...lm.orbs }
    for(let key in inverted){
      inverted[key] *= -1
    }
    return `Your scrolls cost ${orbEntries(inverted)} less.`
  },
  purity: lm => {
    const inverted = { ...lm.orbs }
    for(let key in inverted){
      inverted[key] *= -1
    }
    return `Your items cost ${orbEntries(inverted)} less.`
  },
  big: () => {
    return `${neighbouringIcon()} Neighbouring item slots must be empty.`
  },
  // ascensionScroll: lm => {
  //   return `Is upgraded by ${pluralize('level', lm.levelUp)}, but must have an ${activeAbility('active')} ability.`
  // }
}

export function loadoutModifierToEl(modifier, isItem){

  debugger
  const def = DEFS[modifier.loadoutModifierId]?.(modifier)
  if(def){
    return wrapContent(def)
  }

  const nodes = []
  const contentNodes = []
  if(modifier.subject?.key !== 'self'){
    let content = modifier.conditions?.hasTag === 'scroll' ? 'Your scrolls ' : subjectDescription(modifier.subject, isItem)
    nodes.push(wrapContent(content, { class: 'loadout-modifier-header' }))
  }

  const chunks = []
  if(modifier.orbs){
    const value = { ...modifier.orbs }
    const advClass = Object.keys(value)[0]
    let moreOrLess = 'more'
    if(value[advClass] < 0){
      value[advClass] *= -1
      moreOrLess = 'less'
    }
    chunks.push(`Costs ${orbEntries(value)} ${moreOrLess}.`)
  }
  if(modifier.levelUp){
    chunks.push(`Is upgraded by ${pluralize('level', modifier.levelUp)}.`)
  }
  if(modifier.restrictions){
    const value = modifier.restrictions
    if(value.slot){
      chunks.push(`Can only be equipped in slot ${value.slot}.`)
    }else if(value.empty){
      chunks.push('Must be empty.')
    }else if(value.hasAbility === 'active'){
      chunks.push(`Must have an ${activeAbility()}.`)
    }else if(value.hasStat){
      chunks.push(`Must have ${describeStat(value.hasStat)} stat.`)
    }
  }

  if(modifier.conditions?.hasAbility === 'active'){
    chunks.push('Must have an active ability.')
  }

  if(chunks.length){
    contentNodes.push(wrapContent(chunks.join(' ')))
  }

  if(!contentNodes.length){
    return
  }

  nodes.push(makeEl({ nodes: contentNodes, class: 'loadout-modifier-content' }))
  return makeEl({ nodes })
}