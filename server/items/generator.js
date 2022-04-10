import BaseItems from '../../game/items/combined.js'

export function generateItem(baseType){
  if(!BaseItems[baseType]){
    throw 'Invalid item base type: ' + baseType
  }
  return { ...BaseItems[baseType] }
}