import BaseItems from '../../game/items/combined.js'
import { v4 } from 'uuid'

export function generateItemDef(baseTypeName){
  if(!BaseItems[baseTypeName]){
    throw 'Invalid item base type: ' + baseTypeName
  }
  return {
    id: v4(),
    baseType: baseTypeName
  }
}