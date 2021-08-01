import Item from './item.js'

export function expToLevel(){
  return 1 // todo: exp func
}

export async function validateInventory(level, items){

  if(!Array.isArray(items)){
    throw 'Items was not an array'
  }

  if(items.length !== 8){
    throw 'Wrong number of item slots'
  }

  for(let i = 0; i < items.length; i++){
    if(items[i] === null){
      continue
    }
    const item = new Item(items[i])
    level -= item.itemDefinition.level
  }

  if(level < 0){
    throw 'Combined item level too high.'
  }
}

