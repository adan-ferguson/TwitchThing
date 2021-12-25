const LEVEL_2_XP = 100
const XP_MULTIPLIER = 0.25

export function xpToLevel(xp) {
  let lvl = 1
  while(xp >= levelToXp(lvl + 1)){
    lvl++
  }
  return lvl
}

/**
 * lvl. 1 = 0
 * lvl. 2 = LEVEL_2_XP
 * and so on
 * @param lvl
 * @returns {number}
 */
export function levelToXp(lvl){
  let xp = 0
  let nextXp = LEVEL_2_XP
  for(let i = 1; i < lvl; i++){
    xp += nextXp
    xp = toThreeDigits(xp)
    nextXp *= XP_MULTIPLIER
  }
  return xp

  function toThreeDigits(x){
    x = Math.ceil(x)
    if(x < 1000){
      return x
    }
    x = x + ''
    return parseInt(x.substring(0,3) + x.substring(3).replace(/g/, 0))
  }
}
//
// export async function validateInventory(level, items){
//
//   if(!Array.isArray(items)){
//     throw 'Items was not an array'
//   }
//
//   if(items.length !== 8){
//     throw 'Wrong number of item slots'
//   }
//
//   for(let i = 0; i < items.length; i++){
//     if(items[i] === null){
//       continue
//     }
//     const item = new Item(items[i])
//     level -= item.itemDefinition.level
//   }
//
//   if(level < 0){
//     throw 'Combined item level too high.'
//   }
// }
// export default class Loadout {
//   constructor(adventurerDoc){
//     this.adventurerDoc = adventurerDoc
//   }
// }
