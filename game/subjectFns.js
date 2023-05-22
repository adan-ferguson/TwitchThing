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