import FighterItemLoadoutItem from '../fighterItemLoadoutItem.js'
import AdventurerItem from '../../../game/items/adventurerItem.js'
import AdventurerItemRow from './adventurer/adventurerItemRow.js'
import { ADVENTURER_CLASS_LIST } from '../displayInfo/classDisplayInfo.js'

export function adventurerItemsToRows(items){
  const rows = []
  items.forEach((itemDef, i) => {
    if(itemDef){
      const row = makeAdventurerItemRow(itemDef)
      if(!row){
        return
      }
      row.__slotIndex = i
      rows.push(row)
    }
  })
  return rows
}

export function inventoryItemsToRows(items){
  const rows = []
  Object.keys(items.basic).forEach(itemId => {
    const row = makeAdventurerItemRow(itemId, items.basic[itemId])
    if(row){
      rows.push(row)
    }
  })
  Object.values(items.crafted).forEach(itemDef => {
    const row = makeAdventurerItemRow(itemDef)
    if(row){
      rows.push(row)
    }
  })
  return rows
}

export function rowsToInventoryItems(rows){

  const basic = {}
  const crafted = []

  rows.forEach(row => {
    if(!(row.loadoutItem instanceof FighterItemLoadoutItem)){
      return
    }
    const itemDef = row.loadoutItem.itemInstance.itemDef
    if(row.loadoutItem.isBasic){
      if(!basic[itemDef.group]){
        basic[itemDef.group] = {}
      }
      basic[itemDef.group][itemDef.name] = row.count ?? 1
    }else{
      crafted.push(itemDef.id)
    }
  })

  return {
    basic,
    crafted
  }
}

export function standardItemSort(rowA, rowB){

  const itemA = rowA.adventurerItem
  const itemB = rowB.adventurerItem

  if(!itemA){
    if(!itemB){
      return 0
    }
    return -1
  }
  if(!itemB){
    return 1
  }

  if(itemA.isBasic && !itemB.isBasic){
    return 1
  }else if(!itemA.isBasic && itemB.isBasic){
    return -1
  }

  const orbsA = itemA.orbs
  const orbsB = itemB.orbs

  const classesA = Object.keys(orbsA)
  const classesB = Object.keys(orbsB)

  if(classesA.length < classesB.length){
    return 1
  }else if(classesB.length < classesA.length){
    return -1
  }

  const strA = classesA.join('')
  const strB = classesB.join('')

  if(strA > strB){
    return 1
  }else if(strB > strA){
    return -1
  }

  const totalA = Object.values(orbsA).reduce((prev, val) => prev + val)
  const totalB = Object.values(orbsB).reduce((prev, val) => prev + val)

  if(totalA > totalB){
    return 1
  }else if(totalB > totalA){
    return -1
  }

  return itemA.displayName - itemB.displayName
}

export function addInventoryItem(list, loadoutItem, count = 1){
  const existingRow = list.findRow(row => row.loadoutItem.equals(loadoutItem))
  if(existingRow){
    if(loadoutItem.isBasic){
      existingRow.count += count
    }
    return
  }
  loadoutItem.setOwner(null)
  const row = new LoadoutRow()
  row.setItem(loadoutItem).setCount(count)
  list.addRow(row)
}

export function removeInventoryItem(list, loadoutItem, all = false){
  const existingRow = list.findRow(row => row.loadoutItem === loadoutItem)
  if(!existingRow){
    return
  }
  if(all){
    list.removeRow(existingRow)
    return existingRow.count
  }else{
    if(existingRow.count > 1){
      existingRow.count--
    }else{
      list.removeRow(existingRow)
    }
    return 1
  }
}

export function makeAdventurerItemRow(itemDef, count = 1){
  const item = itemDef instanceof AdventurerItem ? itemDef : new AdventurerItem(itemDef)
  return new AdventurerItemRow().setOptions( { item, count })
}

export function advClassIndex(advClassName){
  return ADVENTURER_CLASS_LIST.findIndex(advClass => advClass.name === advClassName)
}