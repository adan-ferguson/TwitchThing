import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'
import KnowledgeRelic from '../relics/knowledgeRelic.js'
import HealingRelic from '../relics/healingRelic.js'
import TreasureRelic from '../relics/treasureRelic.js'

const RELICS = {
  knowledge: KnowledgeRelic,
  healing: HealingRelic,
  treasure: TreasureRelic
}

const RELIC_CHANCE = 0.20
const VALUE_MULTIPLIER = 0.17
const TRAP_CHANCE = 0.15
const GIVE_UP_CHANCE = 0.15

const TIERS = [
  {
    solveChance: 0.4
  },
  {
    solveChance: 0.24,
    findChance: 0.2
  },
  {
    solveChance: 0.08,
    findChance: 0.05
  },
  {
    solveChance: 0.016,
    findChance: 0.01
  },
  {
    solveChance: 0.002,
    findChance: 0.001
  }
]

const MESSAGES = [
  '%name% tries poking one of the engravings.',
  '%name% kicks the relic.',
  '%name% yells really loud, but nothing happens.',
  '%name% thinks they recognize some of the symbols.',
  '%name% is getting upset with the lack of progress.'
]

export function foundRelic(dungeonRun){
  if(!dungeonRun.user.accomplishments.firstRunFinished){
    return
  }
  return Math.random() <= RELIC_CHANCE
}

export function generateRelicEvent(dungeonRun){
  const type = chooseOne(Object.keys(RELICS).map(relicType => {
    return { value: relicType, weight: RELICS[relicType].frequency(dungeonRun) }
  }))
  const tier = selectTier(dungeonRun.adventurerInstance.stats.get('relicRareChance').value)
  return {
    relic: { type, tier },
    roomType: 'relic',
    stayInRoom: true,
    attempts: 0,
    message: `${dungeonRun.adventurerInstance.displayName} found a relic and is attempting to interpret it.`
  }
}

export async function continueRelicEvent(dungeonRun, previousEvent){

  const relic = previousEvent.relic
  const attemptNo = previousEvent.attempts + 1
  const solveChance = TIERS[relic.tier].solveChance * dungeonRun.adventurerInstance.stats.get('relicSolveChance').value
  const advName = dungeonRun.adventurerInstance.displayName

  let newEvent

  // Additional attempts do additional loops
  for(let i = 0; i < attemptNo; i++){
    if(Math.random() < solveChance){
      newEvent = {
        stayInRoom: false,
        relicSolved: true,
        ...RELICS[relic.type].resolve(dungeonRun, relic.tier, relicValue(dungeonRun))
      }
      newEvent.stayInRoom = false
    }else if(Math.random() < TRAP_CHANCE){
      // TODO: actual traps
      newEvent = {
        stayInRoom: false,
        relicSolved: false,
        message: `${advName} messes up and the relic explodes.`
      }
    }else if(Math.random() < GIVE_UP_CHANCE){
      newEvent = {
        stayInRoom: false,
        relicSolved: false,
        message: `${advName} can't figure it out and gives up.`
      }
    }
  }

  return {
    relic,
    stayInRoom: true,
    attempts: attemptNo,
    roomType: 'relic',
    message: randomMessage(advName, previousEvent.message),
    ...newEvent
  }
}

function randomMessage(name, previousMessage){
  const msg = chooseOne(MESSAGES.map(msg => {
    return { weight: 1, value: msg.replace('%name%', name) }
  }))
  if(msg === previousMessage){
    return randomMessage(name, previousMessage)
  }
  return msg
}

function relicValue(dungeonRun){
  return scaledValue(VALUE_MULTIPLIER, dungeonRun.floor)
}

function selectTier(rareRelicChance){
  for(let i = TIERS.length - 1; i > 0; i--){
    if(Math.random() < TIERS[i].findChance * rareRelicChance){
      return i
    }
  }
  return 0
}