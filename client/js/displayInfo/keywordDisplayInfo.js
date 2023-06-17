import { toDisplayName, wrapContent } from '../../../game/utilFunctions.js'

const DEFS = {
  thwart: {
    description: 'Thwarting is when an enemy action against you fails (dodged, missed, ignored, and so on)'
  }
}

export function keyword(name, displayText = null){
  if(DEFS[name]){
    return wrapContent(displayText ?? toDisplayName(name), {
      tooltip: DEFS[name].description,
      class: 'keyword',
      elementType: 'span'
    }).outerHTML
  }
  return null
}