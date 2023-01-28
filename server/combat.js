import Combats from './collections/combats.js'
import { randomOrder } from '../game/rando.js'
import { generateMonster } from './dungeons/monsters.js'
import MonsterInstance from '../game/monsterInstance.js'
import { takeCombatTurn } from './actionsAndTicks/performAction.js'
import { performCombatTicks } from './actionsAndTicks/ticks.js'
import { toFighterInstance } from '../game/toFighterInstance.js'
import { triggerEvent } from './actionsAndTicks/common.js'
import { CombatResult } from '../game/combatResult.js'

const START_TIME_DELAY = 200
const COMBAT_END_PADDING = 2500
const MAX_TIME = 1000 * 120
const BOSS_MAX_TIME = 1000 * 300
const MIN_RESULT_TIME = 2500

export async function generateCombatEvent(dungeonRun, boss = false){

  console.log('generating a combat')

  const adventurerInstance = dungeonRun.adventurerInstance
  const monsterDef = await generateMonster(dungeonRun, boss)
  const monsterInstance = new MonsterInstance(monsterDef)

  console.log(`${adventurerInstance.displayName} vs ${monsterInstance.displayName}`)

  const combat = await generateCombat(adventurerInstance, monsterInstance, {
    floor: dungeonRun.floor,
    boss
  })

  console.log('Result!', combat)

  adventurerInstance.cleanupState()

  const combatEvent = {
    duration: combat.duration + COMBAT_END_PADDING,
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
    resultEvent.roomType = 'timeover'
  }

  return [combatEvent, resultEvent]
}

export async function generateSimulatedCombat(fighterDef1, fighterDef2){
  fighterDef1._id += 'a'
  fighterDef2._id += 'b'
  const i1 = toFighterInstance(fighterDef1)
  const i2 = toFighterInstance(fighterDef2)
  return await generateCombat(i1, i2, {
    sim: true,
    boss: true
  })
}

export async function generateCombat(fighterInstance1, fighterInstance2, params = {}){

  try {
    const combat = new Combat(fighterInstance1, fighterInstance2, params)
    return await Combats.save({
      startTime: Date.now(),
      duration: combat.duration,
      fighter1: {
        id: 1,
        data: fighterInstance1.fighterData,
        startState: combat.fighterStartState1,
        endState: combat.fighterEndState1
      },
      fighter2: {
        id: 2,
        data: fighterInstance2.fighterData,
        startState: combat.fighterStartState2,
        endState: combat.fighterEndState2
      },
      timeline: combat.timeline,
      result: combat.result,
      params
    })
  }catch(ex){
    console.error('Combat crashed')
  }
}

class Combat{

  constructor(fighterInstance1, fighterInstance2, params){
    this.params = params
    fighterInstance1.inCombat = true
    fighterInstance2.inCombat = true
    fighterInstance1.startCombat(this)
    fighterInstance2.startCombat(this)
    this.fighterStartState1 = {
      ...fighterInstance1.state
    }
    this.fighterStartState2 = {
      ...fighterInstance2.state
    }
    this.fighterInstance1 = fighterInstance1
    this.fighterInstance2 = fighterInstance2
    this._currentTime = START_TIME_DELAY
    this.timeline = []
    this._addTimelineEntry()
    this._run()
    fighterInstance1.endCombat()
    fighterInstance2.endCombat()
    fighterInstance1.inCombat = false
    fighterInstance2.inCombat = false
    this.fighterEndState1 = { ...fighterInstance1.state }
    this.fighterEndState2 = { ...fighterInstance2.state }
    this.duration = this._currentTime
  }

  get time(){
    return this._currentTime
  }

  get result(){
    if(!this.fighterInstance1.hpPct){
      if(!this.fighterInstance2.hpPct){
        return CombatResult.DOUBLE_KO
      }
      return CombatResult.F2_WIN
    }else if(!this.fighterInstance2.hpPct){
      return CombatResult.F1_WIN
    }
    if(this.time >= this.maxTime){
      return CombatResult.TIME_OVER
    }
    return CombatResult.ONGOING
  }

  get finished(){
    return this._currentTime >= this.maxTime || this.fighterInstance1.hp === 0 || this.fighterInstance2.hp === 0
  }

  get maxTime(){
    return this.bossFight ? BOSS_MAX_TIME : MAX_TIME
  }

  get bossFight(){
    return this.params.boss ?? false
  }

  getEnemyOf(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? this.fighterInstance2 : this.fighterInstance1
  }

  _run(){

    while(!this.finished){
      this._advanceTime()

      const tickUpdates = this._tick()
      const actions = this._doActions()
      this.fighterInstance1.cleanupState()
      this.fighterInstance2.cleanupState()

      if(!this.fighterInstance1.hp){
        tickUpdates.push(...triggerEvent(this, this.fighterInstance1, 'defeated'))
      }
      if(!this.fighterInstance2.hp){
        tickUpdates.push(...triggerEvent(this, this.fighterInstance2, 'defeated'))
      }

      this._addTimelineEntry({
        actions,
        tickUpdates
      })
    }
  }

  _advanceTime(){
    const timeToAdvance = Math.ceil(
      Math.min(
        this.fighterInstance1.timeUntilNextUpdate,
        this.fighterInstance2.timeUntilNextUpdate,
        MAX_TIME - this._currentTime
      ))
    this._currentTime += timeToAdvance
    if(timeToAdvance){
      this.fighterInstance1.advanceTime(timeToAdvance)
      this.fighterInstance2.advanceTime(timeToAdvance)
    }
  }

  _tick(){

    const tickUpdates = []

    const doTick = source => {
      tickUpdates.push(...performCombatTicks(this, source))
    }

    randomOrder(
      () => doTick(this.fighterInstance1, this.fighterInstance2),
      () => doTick(this.fighterInstance2, this.fighterInstance1)
    )

    return tickUpdates
  }

  _doActions(){

    const actions = []

    const doAction = actor => {
      if(actor.actionReady){
        actions.push(...takeCombatTurn(this, actor))
      }
    }

    randomOrder(
      () => doAction(this.fighterInstance1, this.fighterInstance2),
      () => doAction(this.fighterInstance2, this.fighterInstance1)
    )

    return actions
  }

  _addTimelineEntry(options = {}){
    let tickUpdates = []
    if(this.time === START_TIME_DELAY){
      tickUpdates = [
        ...triggerEvent(this, this.fighterInstance1, 'startOfCombat'),
        ...triggerEvent(this, this.fighterInstance2, 'startOfCombat')
      ]
    }
    console.log('timeline entry', {
      time: this._currentTime,
      actions: [],
      tickUpdates,
      fighterState1: this.fighterInstance1.state,
      fighterState2: this.fighterInstance2.state,
      ...options
    })
    this.timeline.push({
      time: this._currentTime,
      actions: [],
      tickUpdates,
      fighterState1: this.fighterInstance1.state,
      fighterState2: this.fighterInstance2.state,
      ...options
    })
  }
}