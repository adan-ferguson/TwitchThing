import action from '../assets/icons/action.svg'
import adventurerSlot from '../assets/icons/adventurerSlot.svg'
import chest from '../assets/icons/chest.svg'
import gold from '../assets/icons/gold.svg'
import health from '../assets/icons/health.svg'
import magicDef from '../assets/icons/magicDef.svg'
import magicPower from '../assets/icons/magicPower.svg'
import physDef from '../assets/icons/physDef.svg'
import physPower from '../assets/icons/physPower.svg'

import fighter from '../assets/icons/orbs/fighter.svg'
import mage from '../assets/icons/orbs/mage.svg'
import paladin from '../assets/icons/orbs/paladin.svg'
import rogue from '../assets/icons/orbs/rogue.svg'
const multiclass = fighter

import combatResult from '../assets/rooms/combatResult.png'
import dead from '../assets/rooms/dead.png'
import entrance from '../assets/rooms/entrance.png'
import nextZone from '../assets/rooms/nextZone.png'
import outOfOrder from '../assets/rooms/outOfOrder.png'
import relic from '../assets/rooms/relic.png'
import rest from '../assets/rooms/rest.png'
import stairs from '../assets/rooms/stairs.png'
import timeOver from '../assets/rooms/timeover.png'
import wandering from '../assets/rooms/wandering.png'

export const ICON_SVGS = {
  action,
  adventurerSlot,
  chest,
  gold,
  physPower,
  physDef,
  magicPower,
  magicDef,
  health
}

export const CLASS_SVGS = {
  fighter,
  mage,
  paladin,
  rogue,
  multiclass
}

export const ROOM_IMAGES = {
  combatResult,
  dead,
  entrance,
  nextZone,
  outOfOrder,
  relic,
  rest,
  stairs,
  timeOver,
  wandering
}

export function modifySvgString(svgString, attributes = {}){
  const el = document.createElement('div')
  el.innerHTML = svgString
  const svg = el.querySelector('svg')
  for(let key in attributes){
    svg.setAttribute(key, attributes[key])
  }
  return svg.outerHTML
}