import Picker from '../../game/picker.js'
import AdventurerItem from '../../game/items/adventurerItem.js'
import { getAllItemsByClass } from '../../game/adventurerClassInfo.js'

export function getItemPicker(value, advClass, validRarities){
  return new Picker(getAllItemsByClass()[advClass], {
    weightFormula: baseItem => {
      const item = new AdventurerItem(baseItem.id)
      const rarityInfo = item.rarityInfo
      if(validRarities && !validRarities.includes(item.rarity)){
        return 0
      }
      // If the value remaining is less than the rarity value, there's a chance
      // but it is reduced.
      const pct = Math.min(1, value / rarityInfo.value)
      return rarityInfo.weight * pct
    }
  })
}

export function chooseRandomBasicItem(chestLevel, advClass, validRarities){
  return getItemPicker(chestLevel, advClass, validRarities).pickOne()
}