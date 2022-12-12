import FighterItemDisplayInfo from '../fighterItemDisplayInfo.js'
import AdventurerItemInstance from '../../../game/adventurerItemInstance.js'
import LoadoutRow from './loadout/loadoutRow.js'

export function adventurerItemsToRows(items){
  const rows = []
  items.forEach(itemDef => {
    if(itemDef){
      rows.push(makeRow(itemDef))
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

export function standardItemSort(rowA, rowB){

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

function makeRow(itemDef, count = null){
  const info = new FighterItemDisplayInfo(new AdventurerItemInstance(itemDef))
  const row = new LoadoutRow().setItem(info)
  if(count !== null){
    row.setCount(count)
  }
  return row
}