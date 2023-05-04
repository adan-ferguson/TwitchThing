import { generateMonster } from '../dungeons/monsters.js'
import { CombatResult } from '../../game/combatResult.js'
import { generateCombat } from './interop.js'
import { emit } from '../socketServer.js'
import db from '../db.js'
import { ADVANCEMENT_INTERVAL } from '../dungeons/dungeonRunner.js'

const MIN_RESULT_TIME = 2000
const END_COMBAT_PADDING = 1500

export async function generateCombatEvent(dungeonRun, boss){

  const monsterDef = await generateMonster(dungeonRun, boss)
  const combatID = db.id()
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

export function resumeCombatEvent(dungeonRun){
  runCombat(dungeonRun, dungeonRun.newestEvent.monster)
}

export async function runCombat(dungeonRun, monsterDef){

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
  }else if(combatDoc.result === CombatResult.F2_WIN){
    combatEvent.runFinished = true
    return combatEvent
  }else{
    debugger
  }

  emit(dungeonRun.doc._id, 'dungeon run update', {
    id: dungeonRun.doc._id,
    combatUpdate: {
      newCombatEvent: combatEvent,
      combatDoc: combatDoc
    }
  })
  dungeonRun.finishRunningCombat(combatEvent, resultEvent)
}

export async function generateSimulatedCombat(fighterDef1, fighterDef2){
  fighterDef1._id += 'a'
  fighterDef2._id += 'b'
  return await generateCombat({
    fighterDef1,
    fighterDef2,
    params: {
      sim: true,
      boss: true
    }
  })
}