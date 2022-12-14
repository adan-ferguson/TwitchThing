export function adjustInventoryBasics(invBasics, diff, inverted = false){
  const invInt = inverted ? -1 : 1
  for(let group in diff){
    for(let name in diff[group]){
      if(!invBasics[group]){
        invBasics[group] = {}
      }
      if(!invBasics[group][name]){
        invBasics[group][name] = 0
      }
      invBasics[group][name] += diff[group][name] * invInt
      if(invBasics[group][name] < 0){
        throw `Not enough of basic item: ${group} - ${name}`
      }
    }
  }
  for(let group in invBasics){
    for(let name in invBasics[group]){
      if(invBasics[group][name] === 0){
        delete invBasics[group][name]
      }
    }
  }
}