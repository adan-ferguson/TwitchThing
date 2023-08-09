import { CombatResult } from '../../game/combatResult.js'
import { generateCombat } from './interop.js'
import { emit } from '../socketServer.js'
import { ADVANCEMENT_INTERVAL, cancelRun } from '../dungeons/dungeonRunner.js'
import Combats from '../collections/combats.js'
import MonsterInstance from '../../game/monsterInstance.js'
import { addRewards } from '../dungeons/results.js'

const MIN_RESULT_TIME = 2000
const END_COMBAT_PADDING = 1500

export async function generateCombatEvent(dungeonRun, monsterDef){

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
  runCombat(dungeonRun, dungeonRun.newestEvent.data.monster)
}

export async function runCombat(dungeonRun, monsterDef){

  const adventurerInstance = dungeonRun.adventurerInstance
  const combatEventData = dungeonRun.newestEvent.data

  try {
    const combatDoc = await generateCombat({
      fighterDef1: adventurerInstance.adventurer.doc,
      fighterState1: adventurerInstance.state,
      fighterDef2: monsterDef,
      params: {
        floor: dungeonRun.floor
      }
    }, combatEventData.combatID)

    adventurerInstance.state = combatDoc.fighter1.endState

    const xpBonus = adventurerInstance.stats.get('combatXP').value

    adventurerInstance.endCombat()

    const refereeTime = Math.max(0, combatDoc.times.total - ADVANCEMENT_INTERVAL)
    combatEventData.duration = combatDoc.duration + refereeTime + END_COMBAT_PADDING
    combatEventData.refereeTime = refereeTime
    combatEventData.pending = false

    const resultEventData = {
      duration: MIN_RESULT_TIME,
      result: combatDoc.result,
      combatID: combatDoc._id,
      roomType: 'combatResult',
      monster: monsterDef,
    }

    const endStateMonsterInstance = new MonsterInstance(monsterDef, combatDoc.fighter2.endState)
    if(combatDoc.result === CombatResult.F1_WIN){
      const rewards = addRewards(
        monsterDef.rewards ?? {},
        endStateMonsterInstance.effectInstances.map(ei => ei.effect.rewards).filter(r => r)
      )
      adventurerInstance.food += rewards.food ?? 0
      rewards.xp = Math.round(rewards.xp * xpBonus)
      resultEventData.rewards = rewards
    }else{
      combatEventData.runFinished = true
      return combatEventData
    }

    emit(dungeonRun.doc._id, 'dungeon run update', {
      id: dungeonRun.doc._id,
      combatUpdate: {
        newCombatEvent: combatEventData,
        combatDoc: combatDoc
      }
    })
    dungeonRun.finishRunningCombat(combatEventData, resultEventData)
  }catch(ex){
    combatEventData.error = true
    cancelRun(dungeonRun.doc, ex)
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