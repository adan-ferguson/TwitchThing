import Picker from '../../game/picker.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { getAllItemsByClass } from '../../game/adventurerClassInfo.js'

const BASE_ITEMS = getAllItemsByClass()

export function getItemPicker(value, validClasses){
  return new Picker(BASE_ITEMS, {
    weightFormula: baseItem => {
      const item = new AdventurerItem(baseItem.id)
      const rarityInfo = item.rarityInfo
      if(item.classes.find(cls => validClasses.indexOf(cls) === -1)){
        return 0
      }
      // If the value remaining is less than the rarity value, there's a chance
      // but it is reduced.
      const pct = Math.min(1, value / rarityInfo.value)
      return rarityInfo.weight * pct
    }
  })
}

export function chooseRandomBasicItem(chestLevel, validClasses){
  return getItemPicker(chestLevel, validClasses).pickOne()
}