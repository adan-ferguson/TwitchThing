import Combats from '../collections/combats.js'
import FighterInstance from '../../game/combat/fighterInstance.js'
import { toDisplayName } from '../../game/utilFunctions.js'
import { randomOrder } from '../../game/rando.js'

const START_TIME_DELAY = 1000
const MAX_TIME = 120000

const STATE_VALUES_TO_CLEAR = ['timeSinceLastAction']

export async function generateCombat(fighter1, fighter2, fighterStartState1 = {}, fighterStartState2 = {}){

  const fighterInstance1 = new FighterInstance(fighter1, fighterStartState1, 1)
  const fighterInstance2 = new FighterInstance(fighter2, fighterStartState2, 2)
  const combat = new Combat(fighterInstance1, fighterInstance2)

  return await Combats.save({
    startTime: Date.now() + START_TIME_DELAY,
    duration: combat.duration,
    fighter1: {
      id: 1,
      data: fighter1,
      startState: fighterStartState1,
      endState: combat.fighterEndState1
    },
    fighter2: {
      id: 2,
      data: fighter2,
      startState: fighterStartState2,
      endState: combat.fighterEndState2
    },
    timeline: combat.timeline,
    result: combat.result
  })
}

export async function finishCombatEvent(dungeonRun, combatEvent){
  const combat = await Combats.findOne(combatEvent.combatID)
  const fighter = combat.fighter1.data._id.equals(dungeonRun.adventurer._id) ? combat.fighter1 : combat.fighter2
  const enemy = combat.fighter1.data._id.equals(dungeonRun.adventurer._id) ? combat.fighter2 : combat.fighter1
  const event = {
    adventurerState: fighter.endState
  }
  if(!fighter.endState.hp){
    event.runFinished = true
    event.message = `${fighter.data.name} has fallen, and got kicked out of the dungeon by some mysterious entity.`
  }else if(!enemy.endState.hp){
    event.rewards = enemy.data.rewards
    event.message = `${fighter.data.name} defeated the ${toDisplayName(enemy.data.name)}.`
    event.monster = { ...combatEvent.monster, defeated: true }
  }else{
    event.message = 'That fight was going nowhere so you both just get bored and leave.'
  }
  return event
}

class Combat{

  constructor(fighterInstance1, fighterInstance2){
    this.fighterInstance1 = fighterInstance1
    this.fighterInstance2 = fighterInstance2
    this.timeline = [{
      time: 0,
      fighterState1: this.fighterInstance1.currentState,
      fighterState2: this.fighterInstance2.currentState
    }]
    this._currentTime = 0
    this._run()
    this.fighterEndState1 = cleanupState(this.fighterInstance1.currentState)
    this.fighterEndState2 = cleanupState(this.fighterInstance2.currentState)
    this.duration = this._currentTime
  }

  get result(){
    return {}
  }

  get finished(){
    return this._currentTime === MAX_TIME || !this.fighterInstance1.hp || !this.fighterInstance2.hp
  }

  getEnemyOf(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? this.fighterInstance2 : this.fighterInstance1
  }

  _run(){
    while(!this.finished){
      this._advanceTime()

      const tickUpdates = this._tick()
      const actions = this._doActions()

      if(actions.length || tickUpdates.length){
        this.timeline.push({
          actions,
          tickUpdates,
          time: this._currentTime,
          fighterState1: this.fighterInstance1.currentState,
          fighterState2: this.fighterInstance2.currentState
        })
      }
    }
  }

  _advanceTime(){
    const nextTickTime = 1000 - (this._currentTime % 1000)
    const timeToAdvance = Math.ceil(Math.min(nextTickTime, this.fighterInstance1.timeUntilNextAction, this.fighterInstance2.timeUntilNextAction))
    this._currentTime += timeToAdvance
    this.fighterInstance1.advanceTime(timeToAdvance)
    this.fighterInstance2.advanceTime(timeToAdvance)
  }

  _tick(){

    if(this._currentTime % 1000 !== 0){
      return []
    }

    const tickUpdates = []

    const doTick = source => {
      return { results: source.performTick(this) }
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
        debugger
        const { ability, results } = actor.performAction(this)
        actions.push({
          actor: actor.fighterId,
          ability,
          results
        })
      }
    }

    randomOrder(
      () => doAction(this.fighterInstance1, this.fighterInstance2),
      () => doAction(this.fighterInstance2, this.fighterInstance1)
    )

    return actions
  }

  _1or2(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? 1 : 2
  }
}

function cleanupState(state){
  const cleanedupState = { ...state }
  STATE_VALUES_TO_CLEAR.forEach(key => {
    delete cleanedupState[key]
  })
  return cleanedupState
}