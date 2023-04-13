import { generateMonster, generateSuperMonster } from '../dungeons/monsters.js'
import MonsterInstance from '../../game/monsterInstance.js'
import { CombatResult } from '../../game/combatResult.js'
import { generateCombat } from './interop.js'

const COMBAT_END_PADDING = 2500
const MIN_RESULT_TIME = 2500

export async function generateCombatEvent(dungeonRun, boss = false){

  const adventurerInstance = dungeonRun.adventurerInstance

  let monsterDef
  if(dungeonRun.floor === 51){
    monsterDef = generateSuperMonster(dungeonRun)
  }else{
    monsterDef = await generateMonster(dungeonRun, boss)
  }
  const monsterInstance = new MonsterInstance(monsterDef)

  const combat = await generateCombat(adventurerInstance, monsterInstance, {
    floor: dungeonRun.floor,
    boss
  })

  adventurerInstance.cleanupState()

  const combatEvent = {
    duration: combat.duration + combat.responseTime,
    combatID: combat._id,
    roomType: 'combat',
    monster: monsterDef,
    boss
  }

  const resultEvent = {
    duration: MIN_RESULT_TIME,
    result: combat.result,
    combatID: combat._id,
    roomType: 'combatResult',
    monster: monsterDef,
    boss
  }

  if(combat.result === CombatResult.F1_WIN){
    resultEvent.rewards = monsterDef.rewards
    resultEvent.message = `${adventurerInstance.displayName} has defeated the ${monsterInstance.displayName}.`
  }else if(combat.result === CombatResult.F2_WIN){
    combatEvent.runFinished = true
    return combatEvent
  }else if(combat.result === CombatResult.TIME_OVER){
    resultEvent.message = 'The combat took too long and everyone got bored and left.'
    resultEvent.roomType = 'timeOver'
  }

  return [combatEvent, resultEvent]
}

export async function generateSimulatedCombat(fighterDef1, fighterDef2){
  fighterDef1._id += 'a'
  fighterDef2._id += 'b'
  return await generateCombat(fighterDef1, fighterDef2, {
    sim: true,
    boss: true
  })
}