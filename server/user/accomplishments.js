export function updateAccomplishments(userDoc, adventurerDoc){
  const obj = userDoc.accomplishments.advClasses
  for(let advClass in adventurerDoc.orbs){
    if(!obj[advClass]){
      obj[advClass] = {
        maxOrbs: 0
      }
    }
    obj[advClass].maxOrbs = Math.max(obj[advClass].maxOrbs, adventurerDoc.orbs[advClass])
  }
}