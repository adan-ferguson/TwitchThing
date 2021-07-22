const registeredItems = {}

export async function validateInventory(level, items){

  if(items.length !== 8){
    return 'Wrong number of item slots'
  }

  for(let i = 0; i < items.length; i++){
    if(items[i]){
      const item = getItemDefinition(items[i].id)
      if(!item){
        return 'Invalid item, ID: ' + items[i].id
      }
      level -= item.level
    }
  }

  if(level < 0){
    return 'Too many item levels used.'
  }
}

export class ItemDefinition {

  constructor(){
    if(this.id && this.name && this.level){
      this.valid = true
    }
  }

  get id(){
    throw 'Must implement id getter.'
  }

  get name(){
    throw 'Must implement name getter.'
  }

  get level(){
    throw 'Must implement level getter.'
  }
}

export function register(itemDefinition){
  if(registeredItems[itemDefinition.id]){
    throw 'Duplicate item registered, ID: ' + itemDefinition.id
  }
  registeredItems[itemDefinition.id] = itemDefinition
}

export function getItemDefinition(id){
  const ItemType = registeredItems[id]
  if(!ItemType){
    throw 'Item not found.'
  }
  return registeredItems[id]
}