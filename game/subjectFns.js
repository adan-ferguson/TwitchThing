import { attachedItem, attachedSkill, neighbouring } from '../client/js/components/common.js'

export function subjectKeyMatchesEffectInstances(sourceEffectInstance, subjectEffectInstance, subjectKey){
  if(!subjectKey){
    return true
  }
  if(!sourceEffectInstance || !subjectEffectInstance){
    return subjectKey === 'basicAttack'
  }
  if(subjectKeyMatchesSlotInfos(sourceEffectInstance.slotInfo, subjectEffectInstance.slotInfo, subjectKey)){
    return true
  }
  return false
}

export function subjectKeyMatchesSlotInfos(sourceSlotInfo, subjectSlotInfo, subjectKey){
  if(!sourceSlotInfo || !subjectSlotInfo){
    return false
  }
  if(subjectKey === 'attached'){
    return subjectSlotInfo.col !== sourceSlotInfo.col && sourceSlotInfo.row === subjectSlotInfo.row
  }
}

export function subjectDescription(subjectKey, isItem){
  if(subjectKey === 'self'){
    return 'This '
  }else if(subjectKey === 'allItems'){
    return 'Each equipped item '
  }else if(subjectKey === 'attached'){
    const icon = isItem ? attachedSkill() : attachedItem()
    return `${icon} Attached ${isItem ? 'skill' : 'item'} `
  }else if(subjectKey === 'neighbouring'){
    return`${neighbouring()} Neighbouring ${isItem ? 'Items' : 'Skills'} `
  }
  return ''
}