import Combats from '../collections/combats.js'
import FighterInstance from '../../game/combat/fighterInstance.js'

const START_TIME_DELAY = 1000
const MAX_TIME = 120000

const STATE_VALUES_TO_CLEAR = ['timeSinceLastAction']

export async function generateCombat(fighter1, fighter2, fighterStartState1 = {}, fighterStartState2 = {}){

  const fighterInstance1 = new FighterInstance(fighter1, fighterStartState1)
  const fighterInstance2 = new FighterInstance(fighter2, fighterStartState2)
  const combat = new Combat(fighterInstance1, fighterInstance2)

  return await Combats.save({
    startTime: Date.now() + START_TIME_DELAY,
    duration: combat.duration,
    fighter1: {
      data: fighter1,
      startState: fighterStartState1,
      endState: combat.fighterEndState1
    },
    fighter2: {
      data: fighter2,
      startState: fighterStartState2,
      endState: combat.fighterEndState2
    },
    timeline: combat.timeline,
    result: combat.result
  })
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

  _run(){
    while(!this.finished){
      this._advanceTime()

      let timelineEntry = {}

      if(this._currentTime % 1000 === 0){
        timelineEntry = { ...timelineEntry, ...this._tick() }
      }
      timelineEntry = { ...timelineEntry, ...this._doActions() }

      if(Object.keys(timelineEntry).length){
        timelineEntry.time = this._currentTime
        timelineEntry.fighterState1 = this.fighterInstance1.currentState
        timelineEntry.fighterState2 = this.fighterInstance2.currentState
        this.timeline.push(timelineEntry)
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
    // TODO: ticks
    return {}
  }

  _doActions(){

    const actions = {}

    const f1action = () => {
      if(this.fighterInstance1.actionReady){
        actions.fighterAction1 = this.fighterInstance1.performAction(this.fighterInstance2)
      }
    }

    const f2action = () => {
      if(this.fighterInstance2.actionReady){
        actions.fighterAction2 = this.fighterInstance2.performAction(this.fighterInstance1)
      }
    }

    // Randomize p1 and p2 action if tied
    const fns = [f1action]
    if(Math.random() > 0.5){
      fns.push(f2action)
    }else{
      fns.unshift(f2action)
    }
    fns.forEach(fn => fn())

    return actions
  }
}

function cleanupState(state){
  const cleanedupState = { ...state }
  STATE_VALUES_TO_CLEAR.forEach(key => {
    delete cleanedupState[key]
  })
  return cleanedupState
}