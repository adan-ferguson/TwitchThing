import { attachedItem, attachedSkill, neighbouringIcon } from './components/common.js'

export function subjectDescription(subjectKey, isItem){
  if(subjectKey === 'self'){
    return 'This '
  }else if(subjectKey === 'allItems'){
    return 'Each equipped item '
  }else if(subjectKey === 'attached'){
    return isItem ? attachedSkill(true) : attachedItem(true)
  }else if(subjectKey === 'neighbouring'){
    return`${neighbouringIcon()} Neighbouring ${isItem ? 'Items' : 'Skills'} `
  }else if(subjectKey === 'all'){
    return 'All '
  }
  return ''
}


const LOADOUT_OBJECT_HARDCODES = {
  tetheredManeuver: 'neighbouring'
}

export function subjectKeyForLoadoutObject(loadoutObject){
  if(LOADOUT_OBJECT_HARDCODES[loadoutObject.id]){
    return LOADOUT_OBJECT_HARDCODES[loadoutObject.id]
  }
  const subjectKeys = {}
  for(let me of loadoutObject.metaEffects){
    subjectKeys[me.subjectKey] = true
  }
  for(let ability of loadoutObject.abilities){
    if(ability.conditions?.source){
      subjectKeys[ability.conditions.source] = true
    }
  }
  for(let lm in loadoutObject.loadoutModifiers){
    subjectKeys[lm] = true
  }
  if(subjectKeys.attached){
    return 'attached'
  }
  if(subjectKeys.aboveNeighbour && subjectKeys.belowNeighbour || subjectKeys.neighbouring){
    return 'neighbouring'
  }
}