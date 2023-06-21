import Picker from '../../game/picker.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { getAllItemKeys } from '../../game/adventurerClassInfo.js'

export function getItemPicker(value, advClass, rarity){
  return new Picker(getAllItemKeys(), {
    weightFormula: baseItemKey => {
      const item = new AdventurerItem(baseItemKey)
      if(item.advClass !== advClass){
        return 0
      }
      if(rarity !== item.rarity){
        return 0
      }
      return 1
    }
  })
}

export function chooseRandomBasicItem(chestLevel, advClass, rarity){
  return getItemPicker(chestLevel, advClass, rarity).pickOne()
}