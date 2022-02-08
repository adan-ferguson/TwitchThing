import * as Combats from '../collections/combats.js'

export async function generateCombat(fighter1, fighter2, fighter1startState = {}, fighter2startState = {}){
  const combatSimulation = new CombatSimulation(fighter1, fighter2, fighter1startState, fighter2startState)
  return await Combats.save({
    startTime: new Date(),
    endTime: new Date() + combatSimulation.duration,
    fighter1: {
      data: fighter1,
      startState: fighter1startState,
      endState: combatSimulation.fighter1endState
    },
    fighter2: {
      data: fighter2,
      startState: fighter2startState,
      endState: combatSimulation.fighter2endState
    },
    timeline: combatSimulation.timeline
  })
}

class CombatSimulation{

  constructor(fighter1, fighter2, fighter1startState, fighter2startState){
    this.fighter1 = fighter1
    this.fighter2 = fighter2
    this.timeline = []
    this._currentTime = 0
    this._fighter1currentState = { ...fighter1startState }
    this._fighter2currentState = { ...fighter2startState }
    this._run()
    this.fighter1endState = { ...this._fighter1currentState }
    this.fighter2endState = { ...this._fighter2currentState }
    this.duration = this._currentTime
  }

  _run(){

  }
}