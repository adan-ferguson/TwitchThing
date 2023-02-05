import fighterOrbIcon from '/client/assets/icons/orbs/fighter.svg'
import mageOrbIcon from '/client/assets/icons/orbs/mage.svg'
import paladinOrbIcon from '/client/assets/icons/orbs/paladin.svg'
import rogueOrbIcon from '/client/assets/icons/orbs/rogue.svg'
import { toDisplayName } from '../../game/utilFunctions.js'

const ADV_CLASSES = {
  fighter: {
    description: 'Some description',
    icon: fighterOrbIcon,
    color: '#BB3300'
  },
  mage: {
    description: 'Some description',
    icon: mageOrbIcon,
    color: '#4779da'
  },
  paladin: {
    description: 'Some description',
    icon: paladinOrbIcon,
    color: '#d2a200'
  },
  rogue: {
    description: 'Some description',
    icon: rogueOrbIcon,
    color: '#7a7a7a'
  }
}

for(let className in ADV_CLASSES){
  const cls = ADV_CLASSES[className]
  cls.displayName = toDisplayName(className)
  cls.icon = adjustSvg(cls.icon, cls.color)
}

export default function(className){
  return { ...ADV_CLASSES[className] }
}

function adjustSvg(svgString, color){
  const el = document.createElement('div')
  el.innerHTML = svgString
  const svg = el.querySelector('svg')
  svg.setAttribute('fill', color)
  svg.classList.add('orb-icon')
  return svg.outerHTML
}