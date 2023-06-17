import { generateMonster } from '../dungeons/monsters.js'
import { CombatResult } from '../../game/combatResult.js'
import { generateCombat } from './interop.js'
import { emit } from '../socketServer.js'
import { ADVANCEMENT_INTERVAL, cancelRun } from '../dungeons/dungeonRunner.js'
import Combats from '../collections/combats.js'

const MIN_RESULT_TIME = 2000
const END_COMBAT_PADDING = 1500

export async function generateCombatEvent(dungeonRun, boss){

  const monsterDef = await generateMonster(dungeonRun, boss)
  const combatID = (await Combats.save({}))._id
  const combatEvent = {
    pending: true,
    combatID: combatID,
    duration: 999999999,
    roomType: 'combat',
    monster: monsterDef
  }

  setTimeout(() => {
    runCombat(dungeonRun, monsterDef)
  })

  return combatEvent
}

export async function resumeCombatEvent(dungeonRun){
  runCombat(dungeonRun, dungeonRun.newestEvent.monster)
}

export async function runCombat(dungeonRun, monsterDef){

  try {
    const adventurerInstance = dungeonRun.adventurerInstance
    const combatEvent = dungeonRun.newestEvent
    const combatDoc = await generateCombat({
      fighterDef1: adventurerInstance.adventurer.doc,
      fighterState1: adventurerInstance.state,
      fighterDef2: monsterDef,
      params: {
        floor: dungeonRun.floor
      }
    }, combatEvent.combatID)
    adventurerInstance.state = combatDoc.fighter1.endState
    adventurerInstance.food += monsterDef.rewards?.food ?? 0

    const refereeTime = Math.max(0, combatDoc.times.total - ADVANCEMENT_INTERVAL)
    combatEvent.duration = combatDoc.duration + refereeTime + END_COMBAT_PADDING
    combatEvent.refereeTime = refereeTime
    combatEvent.pending = false

    const resultEvent = {
      duration: MIN_RESULT_TIME,
      result: combatDoc.result,
      combatID: combatDoc._id,
      roomType: 'combatResult',
      monster: monsterDef
    }

    if(combatDoc.result === CombatResult.F1_WIN){
      resultEvent.rewards = monsterDef.rewards
    }else{
      combatEvent.runFinished = true
      return combatEvent
    }

    emit(dungeonRun.doc._id, 'dungeon run update', {
      id: dungeonRun.doc._id,
      combatUpdate: {
        newCombatEvent: combatEvent,
        combatDoc: combatDoc
      }
    })
    dungeonRun.finishRunningCombat(combatEvent, resultEvent)
  }catch(ex){
    cancelRun(dungeonRun.doc, ex)
    return
  }
}

export async function generateSimulatedCombat(fighterDef1, fighterDef2){
  fighterDef1._id += 'a'
  fighterDef2._id += 'b'
  return await generateCombat({
    fighterDef1,
    fighterDef2,
    params: {
      sim: true
    }
  })
}

export async function getCombatArgs(combatID){
  const combat = await Combats.findByID(combatID)
  if(!combat){
    return null
  }
  return {
    fighterDef1: combat.fighter1.def,
    fighterDef2: combat.fighter2.def,
    fighterState1: {},
    fighterState2: {},
    params: combat.params,
  }
}