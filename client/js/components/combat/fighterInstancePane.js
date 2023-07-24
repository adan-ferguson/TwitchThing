import Adventurer from '../../../../game/adventurer.js'
import Modal from '../modal.js'
import AdventurerInfo from '../adventurer/adventurerInfo.js'
import MonsterInfo from '../monster/monsterInfo.js'
import FlyingTextEffect from '../visualEffects/flyingTextEffect.js'
import CustomAnimation from '../../animations/customAnimation.js'
import { mergeOptionsObjects, roundToFixed, toDisplayName } from '../../../../game/utilFunctions.js'
import { DAMAGE_COLORS } from '../../colors.js'
import { flash } from '../../animations/simple.js'
import { ICON_SVGS } from '../../assetLoader.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'
import AdventurerLoadout from '../adventurer/adventurerLoadout.js'
import MonsterLoadout from '../monster/monsterLoadout.js'

const HTML = `
<div class="name"></div>
<di-orb-row class="fighter-orbs displaynone"></di-orb-row>
<div class="absolute-full-size fill-contents standard-contents">
  <div class="flex-rows top-section flex-grow">
    <div class="absolute-full-size">
      <di-hp-bar></di-hp-bar>
      <di-stats-list></di-stats-list>
      <di-effects-list></di-effects-list>
    </div>
  </div>
  <di-action-bar></di-action-bar>
  <div class="loadout-container"></div>
</div>
`

const TEXT_EFFECT_MIN = 0.9
const TEXT_EFFECT_MAX = 2.1
const STAGGER_TIME = 175

export default class FighterInstancePane extends HTMLElement{

  hpBarEl

  _hpChangeQueue

  constructor(){
    super()
    this.classList.add('flex-rows')
    this.innerHTML = HTML
    this.hpBarEl = this.querySelector('di-hp-bar')
    this._actionBarEl = this.querySelector('di-action-bar')
    this.statsList = this.querySelector('di-stats-list').setOptions({
      iconsOnly: true,
      forced: ['physPower','magicPower']
    })
    this._hpChangeQueue = new ResultQueue()

    this.querySelector('.top-section').addEventListener('click', e => {
      this._showFighterInfoModal()
    })
  }

  get basicAttackEl(){
    return this._actionBarEl.querySelector('.bar-badge')
  }

  get loadoutEl(){
    return this.querySelector('.loadout-container > *')
  }

  get effectsListEl(){
    return this.querySelector('di-effects-list')
  }

  setOptions(options){
    this._options = mergeOptionsObjects(this._options, options)
    return this
  }

  setFighter(fighterInstance){
    this.fighterInstance = fighterInstance
    this._setupLoadout()

    this.querySelector('.name').textContent = fighterInstance.displayName
    this.effectsListEl.setFighterInstance(fighterInstance)
    this._actionBarEl.setBaseTime(this.fighterInstance)
    this._update(true)
    return this
  }

  setState(newState, cancelAnimations = false){
    this.fighterInstance.state = newState
    this._update(cancelAnimations)
    return this
  }

  advanceTime(ms){
    if(this.fighterInstance.inCombat && !this.fighterInstance.hasMod('freezeActionBar')){
      this._actionBarEl.advanceTime(ms)
    }
    if(!this.fighterInstance.hasMod('freezeCooldown')){
      this.loadoutEl.advanceTime(ms)
    }
    this.effectsListEl.advanceTime(ms)
  }

  displayActionPerformed(action){
    if(action.actionDef.attack){
      if(action.actionDef.attack.basic){
        const color = DAMAGE_COLORS[this.fighterInstance.basicAttackType]
        flash(this.basicAttackEl, color)
      }
    }
    const effectEl = this._getEffectEl(action.effect)
    effectEl?.flash?.()
  }

  displayResult(result){
    if(result.damageInfo){
      this._queueHpChange(() => this._displayDamageResult(result))
    }else if(result.cancelled){
      this._displayCancellation(result.cancelled)
    }else if(result.healthGained){
      this._queueHpChange(() => this._displayLifeGained(result.healthGained))
    }
  }

  _displayLifeGained(amount){
    if(amount <= 0){
      return
    }
    new FlyingTextEffect(this.hpBarEl, amount, {
      fontSize: TEXT_EFFECT_MIN + Math.min(0.5, amount / this.fighterInstance.hpMax) * TEXT_EFFECT_MAX,
      clearExistingForSource: true
    })
    this.hpBarEl.setValue(amount, { relative: true, animate: true })
  }

  _queueHpChange(fn){
    return this._hpChangeQueue.add(fn)
  }

  _displayDamageResult = (damageResult) => {

    // if(damageResult.cancelled){
    //   this._displayCancellation(damageResult)
    //   return
    // }

    const data = damageResult.damageInfo
    const classes = ['damage']
    if(data.crit){
      classes.push('crit')
    }
    if(data.damageType === 'magic'){
      classes.push('magic')
    }

    for(let distribution of data.damageDistribution){
      const amount = distribution.amount
      if(amount === 0){
        continue
      }
      let dmgStr = roundToFixed(amount, 2)
      let html = `<span class="${classes.join(' ')}">-${dmgStr}${data.crit ? '!!' : ''}</span>`
      let barEl = distribution.id === 'hp' ? this.hpBarEl : this._getEffectEl(distribution.id)?.barEl
      if(!barEl){
        continue
      }
      if(distribution.finalValue){
        barEl.setValue(distribution.finalValue, { animate: true })
      }else{
        barEl.setValue(-amount, { relative: true, animate: true })
      }
      new FlyingTextEffect(barEl, html, {
        html: true,
        fontSize: TEXT_EFFECT_MIN + Math.min(0.5, dmgStr / this.fighterInstance.hpMax) * TEXT_EFFECT_MAX,
        clearExistingForSource: true
      })
    }

    if(data.blocked){
      const blockedHtml = `<span class="blocked">[${data.blocked}]</span>`
      const statEl = this.statsList.querySelector(`di-stat-row[stat-key=${data.damageType}Def]`)
      if(statEl){
        new FlyingTextEffect(statEl, blockedHtml, {
          html: true,
          color: '#000',
          clearExistingForSource: true
        })
      }
    }
  }

  /**
   * @param cancelAnimations
   * @private
   */
  _update(cancelAnimations = false){

    if(this._defeated){
      if(this.fighterInstance.hp){
        this._clearOnDefeat()
      }else{
        return
      }
    }

    if(this.fighterInstance.hpMax !== this.hpBarEl.options.max){
      this.hpBarEl.setOptions({ max: this.fighterInstance.hpMax })
      cancelAnimations = true
    }

    if(cancelAnimations){
      this._hpChangeQueue.clear()
    }

    // TODO: rounding error...
    const diff = Math.abs(this.fighterInstance.hp - this.hpBarEl.value)
    if(diff > 1 && this._hpChangeQueue.isCleared){
      this.hpBarEl.setValue(this.fighterInstance.hp, {
        animate: !cancelAnimations
      })
    }

    this.statsList.setOptions({
      excluded: this._excluded(),
      owner: this.fighterInstance,
    })

    this.statsList.setStats(this.fighterInstance.stats)
    this.effectsListEl.update(cancelAnimations)
    this._updateActionBar(cancelAnimations)
    this.loadoutEl.updateAllRows()
    this.classList.toggle('boss', this.fighterInstance.isBoss ? true : false)

    if(!this.fighterInstance.hp){
      this._showOnDefeat()
      this._defeated = true
    }
  }

  _showFighterInfoModal(){
    const modal = new Modal()
    if(this.fighterInstance instanceof Adventurer){
      modal.innerContent.appendChild(new AdventurerInfo(this.fighterInstance))
    }else{
      modal.innerContent.appendChild(new MonsterInfo(this.fighterInstance))
    }
    modal.show()
  }

  _excluded(){
    const excluded = ['hpMax','speed']
    const magicAttack = this.fighterInstance.hasMod('magicAttack')
    const showPhys = this.fighterInstance.physPower !== this.fighterInstance.basePower
    const showMagic = this.fighterInstance.magicPower !== this.fighterInstance.basePower

    if((showPhys || !magicAttack) && showMagic){
      return [...excluded]
    }else if(magicAttack && !showPhys){
      return [...excluded, 'physPower']
    }else{
      return [...excluded, 'magicPower']
    }
  }

  _getEffectEl(effectId, eventName){
    if(!effectId){
      return null
    }
    return this.querySelector(`.effect-instance[effect-id="${effectId}"]`)
  }

  _displayCancellation(cancelled){
    const reason = cancelled.reasonMsg || toDisplayName(cancelled.reason) || 'Cancelled'
    const targetEl = this._getEffectEl(cancelled.cancelledByEffect) ?? this.hpBarEl
    new FlyingTextEffect(
      targetEl,
      reason,
      {
        clearExistingForSource: true
      }
    )
    flash(targetEl)
  }

  _showOnDefeat(){
    const contents = this.querySelector('.standard-contents')
    contents.classList.remove('displaynone')
    contents.style.opacity = '0'
    this._defeatAnim = new CustomAnimation({
      duration: 1200,
      tick: pct => {
        contents.style.opacity = (1 - pct).toString()
      }
    })
  }

  _clearOnDefeat(){
    this._defeatAnim.cancel()
    this._defeated = false
    this.querySelector('.standard-contents').style.opacity = '1'
  }

  _updateActionBar(cancelAnimations = false){
    const type = this.fighterInstance.basicAttackType
    if(!this._actionBarEl.querySelector('.basic-attack-type-' + type)){
      this._actionBarEl.setBadge(`${ICON_SVGS[type + 'Power']}`)
    }
    this._actionBarEl.setTime(this.fighterInstance, cancelAnimations)
  }

  _setupLoadout(){
    const loadoutContainer = this.querySelector('.loadout-container')
    loadoutContainer.innerHTML = ''
    if(this.fighterInstance instanceof AdventurerInstance){
      loadoutContainer.appendChild(
        new AdventurerLoadout()
          .setOptions({ showState: true })
          .setAdventurer(this.fighterInstance)
      )
    }else{
      loadoutContainer.appendChild(new MonsterLoadout().setMonsterInstance(this.fighterInstance))
    }
  }
}

customElements.define('di-fighter-instance-pane', FighterInstancePane)

class ResultQueue{

  constructor(){
    this._queue = []
  }

  get isCleared(){
    return this._timeout ? false : true
  }

  add(fn){
    this._queue.push(fn)
    if(this._queue.length === 1){
      this._next()
    }
  }

  clear(){
    clearTimeout(this._timeout)
    this._timeout = null
    this._queue = []
  }

  _next(){
    if(!this._queue.length){
      return
    }
    this._queue[0]()
    this._timeout = setTimeout(() => {
      this._timeout = null
      this._queue = this._queue.slice(1)
      this._next()
    }, STAGGER_TIME)
  }
}