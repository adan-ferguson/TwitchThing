import { attachedItem, attachedSkill, neighbouringIcon } from './components/common.js'

export function subjectDescription(subject, isItem){
  const subjectKey = subject.key
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
  }else if(subject.polarity === 'debuff'){
    return 'Your debuffs '
  }
  return ''
}


const LOADOUT_OBJECT_HARDCODES = {
  tetheredManeuver: 'neighbouring',
  shieldBash: 'attached'
}

export function subjectKeyForLoadoutObject(loadoutObject){
  if(LOADOUT_OBJECT_HARDCODES[loadoutObject.id]){
    return LOADOUT_OBJECT_HARDCODES[loadoutObject.id]
  }
  const subjectKeys = {}
  for(let me of loadoutObject.metaEffects){
    if(me.subject.key){
      subjectKeys[me.subject.key] = true
    }
  }
  for(let ability of loadoutObject.abilities){
    if(ability.conditions?.source?.subjectKey){
      subjectKeys[ability.conditions.source.subjectKey] = true
    }
  }
  for(let lm of loadoutObject.loadoutModifiers){
    subjectKeys[lm.subjectKey] = true
  }
  if(subjectKeys.attached){
    return 'attached'
  }
  if(subjectKeys.aboveNeighbour && subjectKeys.belowNeighbour || subjectKeys.neighbouring){
    return 'neighbouring'
  }
}