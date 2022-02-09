import * as Combats from '../collections/combats.js'
import FighterStats from '../../game/fighterStats.js'

export async function generateCombat(fighter1, fighter2, fighter1startState = {}, fighter2startState = {}){
  const fighterInstance1 = new FighterInstance(fighter1, fighter1startState)
  const fighterInstance2 = new FighterInstance(fighter2, fighter2startState)
  const combat = new Combat(fighterInstance1, fighterInstance2)
  return await Combats.save({
    startTime: new Date(),
    endTime: new Date() + combat.duration,
    fighter1: {
      data: fighter1,
      startState: fighter1startState,
      endState: combat.fighterEndState1
    },
    fighter2: {
      data: fighter2,
      startState: fighter2startState,
      endState: combat.fighterEndState2
    },
    timeline: combat.timeline
  })
}

class Combat{

  constructor(fighterInstance1, fighterInstance2){
    this.fighterInstance1 = fighterInstance1
    this.fighterInstance2 = fighterInstance2
    this.timeline = []
    this._currentTime = 0
    this._run()
    this.fighterEndState1 = { ...this.fighterInstance1.currentState }
    this.fighterEndState2 = { ...this.fighterInstance2.currentState }
    this.duration = this._currentTime
  }

  get finished(){
    /// TODO: dead or ran away or something else happened
    return this.fighterInstance1.dead || this.fighterInstance2.dead
  }

  _run(){
    while(!this.finished){
      this._advanceTime()

      const timelineEntry = {
        events: []
      }

      if(this._currentTime % 1000 === 0){
        timelineEntry.events.push(...this._tick())
      }
      timelineEntry.events.push(...this._doActions())

      if(timelineEntry.events.length){
        timelineEntry.time = this._currentTime
        timelineEntry.fighter1state = { ...this._fighter1currentState }
        timelineEntry.fighter2state = { ...this._fighter2currentState }
        this.timeline.push(timelineEntry)
      }
    }
  }

  _advanceTime(){
    const nextTickTime = 1000 - (this._currentTime % 1000)
    const timeToAdvance = Math.min(nextTickTime, this.fighterInstance1.timeUntilNextAction, this.fighterInstance2.timeUntilNextAction)
    this._currentTime += timeToAdvance
    this.fighterInstance1.advanceTime(timeToAdvance)
    this.fighterInstance2.advanceTime(timeToAdvance)
  }

  _tick(){
    return [ ... this.fighterInstance1.tick(), ... this.fighterInstance2.tick() ]
  }

  _doActions(){

    const events = []

    const f1action = () => {
      if(!this.fighterInstance1.timeUntilNextAction){
        events.push(...this.fighterInstance1.performAction(this))
      }
    }

    const f2action = () => {
      if(!this.fighterInstance2.timeUntilNextAction){
        events.push(...this.fighterInstance1.performAction(this))
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

    return events
  }
}