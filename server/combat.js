import Combats from './collections/combats.js'
import { randomOrder } from '../game/rando.js'
import { generateMonster } from './dungeons/monsters.js'
import MonsterInstance from '../game/monsterInstance.js'
import { takeCombatTurn } from './actionsAndTicks/performAction.js'
import { performCombatTick } from './actionsAndTicks/performCombatTick.js'
import { toFighterInstance } from '../game/toFighterInstance.js'

const START_TIME_DELAY = 1000
const MAX_TIME = 120000

export async function generateCombatEvent(dungeonRun){

  const adventurerInstance = dungeonRun.adventurerInstance
  const monsterDef = await generateMonster(dungeonRun)
  const monsterInstance = new MonsterInstance(monsterDef)

  const combat = await generateCombat(adventurerInstance, monsterInstance, {
    floor: dungeonRun.floor
  })

  return {
    duration: combat.duration,
    stayInRoom: true,
    message: `${adventurerInstance.displayName} is fighting a ${monsterInstance.displayName}.`,
    combatID: combat._id,
    passTimeOverride: true,
    roomType: 'combat',
    monster: monsterDef
  }
}

export async function generateSimulatedCombat(fighterDef1, fighterDef2){
  fighterDef1._id += 'a'
  fighterDef2._id += 'b'
  const i1 = toFighterInstance(fighterDef1)
  const i2 = toFighterInstance(fighterDef2)
  return await generateCombat(i1, i2, {
    sim: true
  })
}

export async function generateCombat(fighterInstance1, fighterInstance2, params = {}){

  const combat = new Combat(fighterInstance1, fighterInstance2)

  return await Combats.save({
    startTime: Date.now() + START_TIME_DELAY,
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
}

export async function finishCombatEvent(dungeonRun, combatEvent){
  const combat = await Combats.findByID(combatEvent.combatID)
  const fighter = combat.fighter1.data._id.equals(dungeonRun.adventurer._id) ? combat.fighter1 : combat.fighter2
  const enemy = combat.fighter1.data._id.equals(dungeonRun.adventurer._id) ? combat.fighter2 : combat.fighter1
  const event = {
    adventurerState: fighter.endState,
    passTimeOverride: true
  }
  const monsterInstance = new MonsterInstance(enemy.data)
  if(fighter.endState.hp === 0){
    event.runFinished = true
    event.roomType = 'dead'
    event.message = `${fighter.data.name} has defeated by the ${monsterInstance.displayName}.`
  }else if(enemy.endState.hp === 0){
    event.rewards = enemy.data.rewards
    event.message = `${fighter.data.name} defeated the ${monsterInstance.displayName}.`
    event.monster = { ...combatEvent.monster, defeated: true }
    event.roomType = 'victory'
  }else{
    event.message = 'That fight was going nowhere so you both just get bored and leave.'
  }
  return event
}

class Combat{

  constructor(fighterInstance1, fighterInstance2){
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
    this._currentTime = 0
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
    return {}
  }

  get finished(){
    return this._currentTime === MAX_TIME || this.fighterInstance1.hp === 0 || this.fighterInstance2.hp === 0
  }

  getEnemyOf(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? this.fighterInstance2 : this.fighterInstance1
  }

  _run(){
    while(!this.finished){
      this._advanceTime()

      const tickUpdates = this._tick()
      const actions = this._doActions()

      this.fighterInstance1.cleanup()
      this.fighterInstance2.cleanup()

      if(actions.length || tickUpdates.length){
        this._addTimelineEntry({
          actions,
          tickUpdates
        })
      }
    }
  }

  _advanceTime(){
    const nextTickTime = 1000 - (this._currentTime % 1000)
    const timeToAdvance = Math.ceil(Math.min(nextTickTime, this.fighterInstance1.timeUntilNextAction, this.fighterInstance2.timeUntilNextAction))
    this._currentTime += timeToAdvance
    if(timeToAdvance){
      this.fighterInstance1.advanceTime(timeToAdvance)
      this.fighterInstance2.advanceTime(timeToAdvance)
    }
  }

  _tick(){

    if(this._currentTime % 1000 !== 0){
      return []
    }

    const tickUpdates = []

    const doTick = source => {
      tickUpdates.push(...performCombatTick(this, source))
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
        actions.push(takeCombatTurn(this, actor))
      }
    }

    randomOrder(
      () => doAction(this.fighterInstance1, this.fighterInstance2),
      () => doAction(this.fighterInstance2, this.fighterInstance1)
    )

    return actions
  }

  _addTimelineEntry(options = {}){
    this.timeline.push({
      time: this._currentTime,
      actions: [],
      tickUpdates: [],
      fighterState1: this.fighterInstance1.state,
      fighterState2: this.fighterInstance2.state,
      ...options
    })
  }
}