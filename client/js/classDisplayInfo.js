import warriorOrbIcon from '/client/assets/icons/orbs/warrior.svg'
import mageOrbIcon from '/client/assets/icons/orbs/mage.svg'
import rangerOrbIcon from '/client/assets/icons/orbs/ranger.svg'
import { toDisplayName } from '../../game/utilFunctions.js'

export default function(className){

  let obj = {}

  // Adventurer Classes
  if(className === 'warrior'){
    obj = {
      description: 'Some description',
      orbIcon: warriorOrbIcon,
      color: '#BB3300'
    }
  }else if(className === 'mage'){
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