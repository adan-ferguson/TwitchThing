import { toDisplayName } from '../../../game/utilFunctions.js'
import { ORB_SVGS, modifySvgString } from '../assetLoader.js'

const ADV_CLASSES = {
  fighter: {
    description: 'The starter class that loves to fight. High physical damage output, but also some survivability.',
    color: '#BB3300'
  },
  mage: {
    description: 'A magical spell caster. Use gems to modify spell and create combos.',
    color: '#4779da'
  },
  paladin: {
    description: 'A defense-oriented class. Specializes in shields and the "block" mechanic.',
    color: '#d2a200'
  },
  rogue: {
    description: 'A sneaky jerk who specializes in treasure-finding, but has some fighting abilities',
    color: '#7a7a7a'
  },
  chimera: {
    description: 'A humanoid with beastly tendencies. And beastly body-parts. Has a hodgepodge of abilities.',
    color: '#98ab65'
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