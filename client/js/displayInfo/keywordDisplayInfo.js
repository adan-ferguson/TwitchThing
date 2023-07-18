import { toDisplayName, wrapContent } from '../../../game/utilFunctions.js'
import { faIcon } from '../components/common.js'

const DEFS = {
  thwart: {
    description: 'Thwarting is when an enemy action against you fails (dodged, missed, ignored, and so on)'
  },
  stunned: {
    description: 'Action bar stops filling.'
  },
  blinded: {
    description: 'Attacks auto-miss.'
  },
  asleep: {
    description: 'Action bar stops filling. Ends upon taking damage.'
  },
  diminishingReturns: {
    icon: faIcon('angles-down'),
    description: 'Repeated uses have diminishing returns.'
  },
  overtime: {
    description: '60 seconds into combat (unless something affects it or I changed it and forgot to update this tooltip which will probably happen)'
  },
  stacks: {
    icon: faIcon('layer-group'),
    description: 'Stacks'
  }
}

export function keyword(name, displayText = null){
  if(DEFS[name]){
    return wrapContent(displayText ?? DEFS[name].icon ?? toDisplayName(name), {
      tooltip: DEFS[name].description,
      class: 'keyword',
      elementType: 'span'
    }).outerHTML
  }
  return null
}

export function dimret(){
  return keyword('diminishingReturns')
}