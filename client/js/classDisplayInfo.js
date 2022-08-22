import fighterOrbIcon from '/client/assets/icons/orbs/fighter.svg'
import mageOrbIcon from '/client/assets/icons/orbs/mage.svg'
import rangerOrbIcon from '/client/assets/icons/orbs/ranger.svg'
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
  }else if(className === 'tank'){
    obj = {
      description: 'Some description',
      orbIcon: mageOrbIcon,
      color: '#5577BB'
    }
  }else if(className === 'ranger'){
    obj = {
      description: 'Some description',
      orbIcon: rangerOrbIcon,
      color: '#55AA33'
    }
  }

  obj.displayName = toDisplayName(className)
  return obj
}