import fighterOrbIcon from '/client/assets/icons/orbs/fighter.svg'
import mageOrbIcon from '/client/assets/icons/orbs/mage.svg'
import paladinOrbIcon from '/client/assets/icons/orbs/paladin.svg'
import { toDisplayName } from '../../game/utilFunctions.js'

export default function(className){

  let obj = {}

  // Adventurer Classes
  if(className === 'fighter'){
    obj = {
      description: 'Some description',
      orbIcon: fighterOrbIcon,
      color: '#BB3300'
    }
  }else if(className === 'mage'){
    obj = {
      description: 'Some description',
      orbIcon: mageOrbIcon,
      color: '#4779da'
    }
  }else if(className === 'paladin'){
    obj = {
      description: 'Some description',
      orbIcon: paladinOrbIcon,
      color: '#d2a200'
    }
  }else{
    return null
  }

  obj.displayName = toDisplayName(className)
  return obj
}