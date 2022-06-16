import scaledValue from '../../game/scaledValue.js'
import { chooseOne } from '../../game/rando.js'
import RelicDefinitions from '../relics/knowledgeRelic.js'

const BASE_RELIC_CHANCE = 0.2
const RELIC_CHANCE_SCALE = 0.03
const VALUE_MULTIPLIER = 0.25

const SOLVE_CHANCES = {
  simple: 0.40,
  intricate: 0.15,
  perplexing: 0.05,
  impossible: 0.005
}

const MESSAGES = [
  '%name% tries poking the relic but nothing happens.',
  '%name% is still trying to decipher the meaning of the relic.',
  '%name% tries singing to the relic.',
  '%name% thinks they recognize some of the text on the relic.',
  '%name% is getting nowhere and is getting frustrated.'
]

export function foundRelic(dungeonRun){
  if(!dungeonRun.user.features.items){
    return
  }
  const relicChance = BASE_RELIC_CHANCE / scaledValue(RELIC_CHANCE_SCALE, dungeonRun.floor - 1)
  return Math.random() <= relicChance * dungeonRun.adventurerInstance.stats.get('relicFind').value
}

export function generateRelicEvent(dungeonRun){
  const relicType = chooseOne(Object.keys(RelicDefinitions).map(relicType => {
    return { value: relicType, weight: RelicDefinitions[relicType].frequency(dungeonRun) }
  }))
  return {
    relic: generateRelic(relicType, dungeonRun),
    stayInRoom: true,
    attempts: 0,
    message: `${dungeonRun.adventurerInstance.name} found a relic and is attempting to interpret it.`
  }
}

export function continueRelicEvent(dungeonRun, previousEvent){

  const relic = previousEvent.relic
  const attemptNo = previousEvent.attempts + 1
  const interpretationChance = SOLVE_CHANCES[relic.difficulty] * dungeonRun.adventurerInstance.stats.get('relicKnowledge').value
  const trapChance = 0.08
  const giveUpChance = 0.08
  const advName = dungeonRun.adventurerInstance.name

  const newEvent = {
    relic,
    stayInRoom: true,
    attempts: attemptNo,
    message: randomMessage(advName, previousEvent.message)
  }

  for(let i = 0; i < attemptNo; i++){
    if(Math.random() < interpretationChance){
      newEvent.stayInRoom = false
      RelicDefinitions[relic.type].resolve(newEvent, dungeonRun)
    }else if(Math.random() < trapChance){
      // TODO: actual traps
      newEvent.stayInRoom = false
      newEvent.message = `${advName} messes up and the relic explodes.`
    }else if(Math.random() < giveUpChance){
      newEvent.stayInRoom = false
      newEvent.message = `${advName} can't figure it out and gives up.`
    }
  }

  return newEvent
}

function generateRelic(relicType, dungeonRun){
  const generatedRelic = RelicDefinitions[relicType].generate(dungeonRun)
  generatedRelic.type = relicType
  return generatedRelic
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
  return scaledValue(VALUE_MULTIPLIER, dungeonRun.floor, dungeonRun.adventurerInstance.stats.get('relicQuality')).value
}