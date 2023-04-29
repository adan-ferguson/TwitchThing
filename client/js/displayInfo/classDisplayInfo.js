import { toDisplayName } from '../../../game/utilFunctions.js'
import { ORB_SVGS, modifySvgString } from '../assetLoader.js'

const ADV_CLASSES = {
  fighter: {
    description: 'Some description',
    color: '#BB3300'
  },
  mage: {
    description: 'Some description',
    color: '#4779da'
  },
  paladin: {
    description: 'Some description',
    color: '#d2a200'
  },
  rogue: {
    description: 'Some description',
    color: '#7a7a7a'
  },
  chimera: {
    description: 'Some description',
    color: '#7a7a7a'
  }
}

for(let className in ADV_CLASSES){
  const cls = ADV_CLASSES[className]
  cls.name = className
  cls.className = className
  cls.displayName = toDisplayName(className)
  cls.icon = modifySvgString(ORB_SVGS[className], {
    class: 'orb-icon',
    fill: cls.color
  })
  cls.colorlessIcon = modifySvgString(ORB_SVGS[className], {
    class: 'orb-icon',
    fill: '#BBB'
  })
}

export default function(className){
  return { ...ADV_CLASSES[className] }
}

export const ADVENTURER_CLASS_LIST = Object.values(ADV_CLASSES)

export function classIcon(className){
  return ADV_CLASSES[className]?.icon
}