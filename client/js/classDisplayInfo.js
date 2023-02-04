import fighterOrbIcon from '/client/assets/icons/orbs/fighter.svg'
import mageOrbIcon from '/client/assets/icons/orbs/mage.svg'
import paladinOrbIcon from '/client/assets/icons/orbs/paladin.svg'
import rogueOrbIcon from '/client/assets/icons/orbs/rogue.svg'
import { toDisplayName } from '../../game/utilFunctions.js'

const ADV_CLASSES = {
  fighter: {
    description: 'Some description',
    orbIcon: fighterOrbIcon,
    color: '#BB3300'
  },
  mage: {
    description: 'Some description',
    orbIcon: mageOrbIcon,
    color: '#4779da'
  },
  paladin: {
    description: 'Some description',
    orbIcon: paladinOrbIcon,
    color: '#d2a200'
  },
  rogue: {
    description: 'Some description',
    orbIcon: rogueOrbIcon,
    color: '#7a7a7a'
  }
}
export default function(className){
  const obj = { ...ADV_CLASSES[className] }
  obj.displayName = toDisplayName(className)
  return obj
}