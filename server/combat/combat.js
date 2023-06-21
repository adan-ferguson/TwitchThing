import { toFighterInstance } from '../../game/toFighterInstance.js'
import { CombatResult } from '../../game/combatResult.js'
import { shuffle } from '../../game/rando.js'
import { takeCombatTurn } from './takeCombatTurn.js'
import { processAbilityEvents } from '../mechanics/abilities.js'
import { performAction, useAbility } from '../mechanics/actions/performAction.js'
import { overtimeDamageBonus } from '../../game/combatMechanics.js'
import { arrayize } from '../../game/utilFunctions.js'
import { gainBlockBarrier } from '../mechanics/gainStatusEffect.js'
import AdventurerInstance from '../../game/adventurerInstance.js'

const MAX_CONSECUTIVE_ZERO_TIME_ADVANCEMENTS = 30
const MAX_TRIGGER_LOOPS = 30
const MAX_TRIGGER_COUNTER = 500

const OVERTIME = 60000
const SUDDEN_DEATH = 120000

export async function runCombat(data, params = {}){
  data = {
    fighterDef1: null,
    fighterDef2: null,
    fighterState1: {},
    fighterState2: {},
    params,
    ...data
  }

  if(!data.fighterDef1 || !data.fighterDef2){
    throw 'Combat missing fighter def'
  }

  const timestamp = Date.now()
  const fighterInstance1 = toFighterInstance(data.fighterDef1, data.fighterState1)
  const fighterInstance2 = toFighterInstance(data.fighterDef2, data.fighterState2)
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
    date: new Date(),
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
  _lastTimestamp = Date.now()

  constructor(fighterInstance1, fighterInstance2, params){
    this.params = params
    this.fighterInstance1 = fighterInstance1
    this.fighterInstance2 = fighterInstance2
    this.fighters.forEach(fi => {
      fi.startCombat({
        bossFight: this.getEnemyOf(fi).isBoss
      })
    })
    this.fighterStartState1 = {
      ...fighterInstance1.state,
      inCombat: true
    }
    this.fighterStartState2 = {
      ...fighterInstance2.state,
      inCombat: true
    }
    this.timeline = []
    this._startCombat()
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
    return this.fighterInstance1.dead || this.fighterInstance2.dead
  }

  get bossFight(){
    return this.params.boss ?? false
  }

  get fighters(){
    return [this.fighterInstance1, this.fighterInstance2]
  }

  get msOvertime(){
    return Math.max(0, this._currentTime - OVERTIME)
  }

  get overtimeDamageBonus(){
    return overtimeDamageBonus(this.msOvertime)
  }

  get nextSuddenDeathTick(){
    const nextSecond = 1000 * Math.ceil((1 + this._currentTime) / 1000)
    const nextTickTime = Math.max(SUDDEN_DEATH, nextSecond)
    return nextTickTime - this._currentTime
  }

  addPendingTriggers(pendingTriggers){
    this._pendingTriggers.push(...arrayize(pendingTriggers))
    if(this._pendingTriggers.length > MAX_TRIGGER_COUNTER){
      throw 'Trigger counter excessively high, probably infinite loop.'
    }
  }

  getEnemyOf(fighterInstance){
    return this.fighterInstance1 === fighterInstance ? this.fighterInstance2 : this.fighterInstance1
  }

  _startCombat(){
    // Time = 0 before start-of-combat triggers
    // Time = 1 resolve start-of-combat triggers
    this._addTimelineEntry()
    this._currentTime = 1
    this.fighters.forEach(fi => {
      gainBlockBarrier(this, fi)
      processAbilityEvents(this, 'startOfCombat', fi, null)
    })
    this._resolveTriggers()
    this._addTimelineEntry()
    this._run()
  }

  _run(){
    while(!this.finished){
      this._advanceTime()
      const actions = this._doActions()
      // if(!this.fighterInstance1.hp){
      //   processAbilityEvents(this, 'defeated', this.fighterInstance1)
      // }
      // if(!this.fighterInstance2.hp){
      //   processAbilityEvents(this, 'defeated', this.fighterInstance2)
      // }
      this._triggerSuddenDeath()
      this._resolveTriggers()
      this._addTimelineEntry({
        actions
      })
    }
  }

  _advanceTime(){
    const nexts = [
      ...this.fighters.map(fi => fi.timeUntilNextUpdate),
      OVERTIME - this.time > 0 ? OVERTIME - this.time + 1 : Number.MAX_VALUE,
      this.nextSuddenDeathTick
    ]
    const timeToAdvance = Math.ceil(Math.max(1, Math.min(...nexts)))
    if(timeToAdvance === 1){
      this._consecutiveZeroTimeAdvancements++
      if(this._consecutiveZeroTimeAdvancements >= MAX_CONSECUTIVE_ZERO_TIME_ADVANCEMENTS){
        throw 'Combat was no longer advancing time, probably infinite loop.'
      }
    }else{
      this._consecutiveZeroTimeAdvancements = 0
    }
    this._currentTime += timeToAdvance
    if(timeToAdvance){
      this.fighters.forEach(fi => {
        fi.updateCombat({
          time: this._currentTime,
          overtime: this._currentTime >= OVERTIME
        })
        fi.advanceTime(timeToAdvance)
        processAbilityEvents(this, 'instant', fi)
      })
    }
    this._resolveTriggers()
  }

  _resolveTriggers(){

    const resolveTrigger = trigger => {
      if(trigger.performAction){
        return performAction(this, trigger.actor, trigger.ability, trigger.def, trigger.data)
      }else{
        return useAbility(this, trigger.ability, trigger.data)
      }
    }

    let loops = 0
    while(this._pendingTriggers.length && loops < MAX_TRIGGER_LOOPS){
      const triggers = this._pendingTriggers
      this._pendingTriggers = []
      this._triggerUpdates.push(...triggers.map(resolveTrigger).flat())
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

  _addTimelineEntry(options = {}){
    this.fighters.forEach(f => f.uncache())
    const next = {
      time: this._currentTime,
      calculationTime: Date.now() - this._lastTimestamp,
      actions: [],
      triggers: this._triggerUpdates,
      fighterState1: this.fighterInstance1.state,
      fighterState2: this.fighterInstance2.state,
      overtime: this.msOvertime,
      suddenDeath: this._currentTime > SUDDEN_DEATH ? true : false,
      ...options
    }
    this.timeline.push(next)
    this._triggerUpdates = []
    this._lastTimestamp = Date.now()
  }

  _triggerSuddenDeath(){
    const diff = (this._currentTime - SUDDEN_DEATH) / 1000
    if(diff % 1 === 0 && diff > 0){
      this.addPendingTriggers(
        this.fighters
          .filter(fi => fi instanceof AdventurerInstance)
          .map(fi => {
            return {
              performAction: true,
              actor: fi,
              def: {
                takeDamage: {
                  scaling: {
                    hpMax: 0.02 + diff / 300
                  },
                  damageType: diff % 2 ? 'phys' : 'magic',
                  ignoreDefense: true,
                  ignoreOvertime: true
                },
              }
            }
          })
      )
    }
  }
}