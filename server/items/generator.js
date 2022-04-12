import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'

export function generateItem(baseType){
  if(!BaseItems[baseType]){
    throw 'Invalid item base type: ' + baseType
  }
  return {
    id: v4(),
    ...BaseItems[baseType]
  }
}