import { toFighterInstance } from '../../game/toFighterInstance.js'
import { CombatResult } from '../../game/combatResult.js'
import { shuffle } from '../../game/rando.js'
import { takeCombatTurn } from './takeCombatTurn.js'
import { processAbilityEvents } from '../mechanics/abilities.js'
import { useAbility } from '../actions/performAction.js'

const MAX_CONSECUTIVE_ZERO_TIME_ADVANCEMENTS = 30
const MAX_TRIGGER_LOOPS = 30
const MAX_TRIGGER_COUNTER = 500

export function runCombat(data){
  const timestamp = Date.now()
  const fighterInstance1 = toFighterInstance(data.fighterDef1)
  const fighterInstance2 = toFighterInstance(data.fighterDef2)
  const combat = new Combat(fighterInstance1, fighterInstance2, data.params)
  return {
    times: {
      start: timestamp,
      finish: Date.now()
    },
    duration: combat.duration,
    fighter1: {
      id: 1,
      def: data.fighterDef1,
      startState: combat.fighterStartState1,
      endState: combat.fighterEndState1
    },
    fighter2: {
      id: 2,
      def: data.fighterDef2,
      startState: combat.fighterStartState2,
      endState: combat.fighterEndState2
    },
    timeline: combat.timeline,
    result: combat.result,
    params: data.params
  }
}

class Combat{

  _pendingTriggers = []
  _triggerUpdates = []
  _consecutiveZeroTimeAdvancements = 0
  _currentTime = 0

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
    this.timeline = []
    this._startCombat()
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
    return CombatResult.ONGOING
  }

  get finished(){
    return this.fighterInstance1.hp === 0 || this.fighterInstance2.hp === 0
  }

  get bossFight(){
    return this.params.boss ?? false
  }

  addPendingTriggers(pendingTriggers){
    this._pendingTriggers.push(...pendingTriggers)
    if(this._pendingTriggers.length > MAX_TRIGGER_COUNTER){
      throw 'Trigger counter excessively high, probably infinite loop.'
    }
  }

  getEnemyOf(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? this.fighterInstance2 : this.fighterInstance1
  }

  _run(){

    while(!this.finished){
      this._advanceTime()
      const actions = this._doActions()

      // this.fighterInstance1.cleanupState()
      // this.fighterInstance2.cleanupState()

      if(!this.fighterInstance1.hp){
        processAbilityEvents(this, 'defeated', this.fighterInstance1)
      }
      if(!this.fighterInstance2.hp){
        processAbilityEvents(this, 'defeated', this.fighterInstance2)
      }

      this._addTimelineEntry({
        actions
      })
    }
  }

  _advanceTime(){
    const timeToAdvance = Math.ceil(
      Math.max(0, Math.min(
        this.fighterInstance1.timeUntilNextUpdate,
        this.fighterInstance2.timeUntilNextUpdate
      )))
    if(!timeToAdvance){
      this._consecutiveZeroTimeAdvancements++
      if(this._consecutiveZeroTimeAdvancements >= MAX_CONSECUTIVE_ZERO_TIME_ADVANCEMENTS){
        throw 'Combat was no longer advancing time, probably infinite loop.'
      }
    }else{
      this._consecutiveZeroTimeAdvancements = 0
    }
    this._currentTime += timeToAdvance
    if(timeToAdvance){
      this.fighterInstance1.advanceTime(timeToAdvance)
      this.fighterInstance2.advanceTime(timeToAdvance)
      // TODO: performCombatTicks
    }
    this._resolveTriggers()
  }

  _resolveTriggers(){

    const resolveTrigger = trigger => {
      return useAbility(this, trigger.ability, trigger.data)
    }

    let loops = 0
    while(this._pendingTriggers.length && loops < MAX_TRIGGER_LOOPS){
      const triggers = this._pendingTriggers
      this._pendingTriggers = []
      this._triggerUpdates.push(...triggers.map(resolveTrigger))
      loops++
      if(this.finished){
        return
      }
    }
  }

  _doActions(){

    if(this.finished){
      return []
    }

    const actions = []

    shuffle([this.fighterInstance1, this.fighterInstance2]).forEach(actor => {
      actions.push(...takeCombatTurn(this, actor))
    })

    return actions
  }

  _startCombat(){
    processAbilityEvents(this, 'startOfCombat', this.fighterInstance1)
    processAbilityEvents(this, 'startOfCombat', this.fighterInstance2)
    this._addTimelineEntry()
  }

  _addTimelineEntry(options = {}){
    this.timeline.push({
      time: this._currentTime,
      actions: [],
      triggers: this._triggerUpdates,
      fighterState1: this.fighterInstance1.state,
      fighterState2: this.fighterInstance2.state,
      ...options
    })
    this._triggerUpdates = []
  }
}