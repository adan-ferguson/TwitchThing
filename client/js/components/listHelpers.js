import FighterItemLoadoutItem from '../fighterItemLoadoutItem.js'
import AdventurerItemInstance from '../../../game/adventurerItemInstance.js'
import LoadoutRow from './loadout/loadoutRow.js'

export function adventurerItemsToRows(items){
  const rows = []
  items.forEach((itemDef, i) => {
    if(itemDef){
      const row = makeRow(itemDef)
      row.__slotIndex = i
      rows.push(row)
    }
  })
  return rows
}

export function inventoryItemsToRows(items){
  const rows = []
  Object.keys(items.basic).forEach(group => {
    Object.keys(items.basic[group]).forEach(name => {
      rows.push(makeRow({ group, name }, items.basic[group][name]))
    })
  })
  Object.values(items.crafted).forEach(itemDef => {
    rows.push(makeRow(itemDef))
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

  if(rowA.loadoutItem.isBasic && !rowB.loadoutItem.isBasic){
    return 1
  }else if(!rowA.loadoutItem.isBasic && rowB.loadoutItem.isBasic){
    return -1
  }

  const orbsA = rowA.loadoutItem.orbs._maxOrbs
  const orbsB = rowB.loadoutItem.orbs._maxOrbs

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

  return rowA.loadoutItem.displayName - rowB.loadoutItem.displayName
}

export function addInventoryItem(list, loadoutItem){
  const existingRow = list.findRow(row => row.loadoutItem.equals(loadoutItem))
  if(existingRow){
    if(loadoutItem.isBasic){
      existingRow.count++
    }
    return
  }
  loadoutItem.setOwner(null)
  const row = new LoadoutRow()
  row.setItem(loadoutItem)
  list.addRow(row)
}

export function removeInventoryItem(list, loadoutItem){
  const existingRow = list.findRow(row => row.loadoutItem === loadoutItem)
  if(!existingRow){
    return
  }
  if(existingRow.count > 1){
    existingRow.count--
  }else{
    list.removeRow(existingRow)
  }
}

function makeRow(itemDef, count = null){
  const info = new FighterItemLoadoutItem(new AdventurerItemInstance(itemDef))
  const row = new LoadoutRow().setItem(info)
  if(count !== null){
    row.setCount(count)
  }
  return row
}