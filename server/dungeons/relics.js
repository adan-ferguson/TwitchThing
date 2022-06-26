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

const RELIC_CHANCE = 0.25
const VALUE_MULTIPLIER = 0.2

const TIERS = [
  {
    solveChance: 0.4
  },
  {
    solveChance: 0.2,
    findChance: 0.2
  },
  {
    solveChance: 0.05,
    findChance: 0.05
  },
  {
    solveChance: 0.01,
    findChance: 0.01
  },
  {
    solveChance: 0.001,
    findChance: 0.001
  }
]

const MESSAGES = [
  '%name% tries poking the relic but nothing happens.',
  '%name% is still trying to decipher the meaning of the relic.',
  '%name% tries singing to the relic.',
  '%name% thinks they recognize some of the text on the relic.',
  '%name% is getting nowhere and is getting frustrated.'
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
    stayInRoom: true,
    attempts: 0,
    message: `${dungeonRun.adventurerInstance.name} found a relic and is attempting to interpret it.`
  }
}

export async function continueRelicEvent(dungeonRun, previousEvent){

  const relic = previousEvent.relic
  const attemptNo = previousEvent.attempts + 1
  const solveChance = TIERS[relic.tier].solveChance * dungeonRun.adventurerInstance.stats.get('relicSolveChance').value
  const trapChance = 0.08
  const giveUpChance = 0.08
  const advName = dungeonRun.adventurerInstance.name

  let newEvent

  // Additional attempts do additional loops
  for(let i = 0; i < attemptNo; i++){
    if(Math.random() < solveChance){
      newEvent = {
        stayInRoom: false,
        ...RELICS[relic.type].resolve(dungeonRun, relic.tier, relicValue(dungeonRun))
      }
      newEvent.stayInRoom = false
    }else if(Math.random() < trapChance){
      // TODO: actual traps
      newEvent = {
        stayInRoom: false,
        message: `${advName} messes up and the relic explodes.`
      }
    }else if(Math.random() < giveUpChance){
      newEvent = {
        stayInRoom: false,
        message: `${advName} can't figure it out and gives up.`
      }
    }
  }

  return {
    relic,
    stayInRoom: true,
    attempts: attemptNo,
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