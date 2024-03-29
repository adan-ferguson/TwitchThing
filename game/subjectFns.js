export function subjectKeyMatchesEffectInstances(sourceEffectInstance, subjectEffectInstance, subjectKey){
  if(!subjectKey){
    return true
  }
  if(!sourceEffectInstance || !subjectEffectInstance){
    return subjectKey === 'basicAttack'
  }
  if(subjectKey === 'all'){
    return true
  }
  if(subjectKey === 'self'){
    return sourceEffectInstance.uniqueID === subjectEffectInstance.uniqueID
  }
  if(subjectKeyMatchesSlotInfos(sourceEffectInstance.slotInfo, subjectEffectInstance.slotInfo, subjectKey)){
    return true
  }
  return false
}

export function getMatchingEffectInstances(sourceEffectInstance, subjectKey){
  return sourceEffectInstance.fighterInstance.effectInstances.filter(ei => {
    // TODO: too slow?
    return subjectKeyMatchesEffectInstances(sourceEffectInstance, ei, subjectKey)
  })
}

export function subjectKeyMatchesSlotInfos(sourceSlotInfo, subjectSlotInfo, subjectKey){
  if(!sourceSlotInfo || !subjectSlotInfo){
    return false
  }
  if(subjectKey === 'attached'){
    return subjectSlotInfo.col !== sourceSlotInfo.col && sourceSlotInfo.row === subjectSlotInfo.row
  }
  if(subjectKey === 'aboveNeighbour'){
    return subjectSlotInfo.col === sourceSlotInfo.col && subjectSlotInfo.row === sourceSlotInfo.row - 1
  }
  if(subjectKey === 'belowNeighbour'){
    return subjectSlotInfo.col === sourceSlotInfo.col && subjectSlotInfo.row === sourceSlotInfo.row + 1
  }
}

export function getMatchingSlots(col, row, subjectKey){
  const matches = []
  const sourceSlot = { col, row }
  for(let col = 0; col < 2; col++){
    for(let row = 0; row < 8; row++){
      const subjectSlot = { col, row }
      if(subjectKeyMatchesSlotInfos(sourceSlot, subjectSlot, subjectKey)){
        matches.push(subjectSlot)
      }
    }
  }
  return matches
}