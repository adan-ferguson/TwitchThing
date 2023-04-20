import Adventurer from '../../../../game/adventurer.js'
import Modal from '../modal.js'
import AdventurerInfo from '../adventurer/adventurerInfo.js'
import MonsterInfo from '../monsterInfo.js'
import FlyingTextEffect from '../visualEffects/flyingTextEffect.js'
import CustomAnimation from '../../animations/customAnimation.js'
import { mergeOptionsObjects, roundToFixed, toDisplayName } from '../../../../game/utilFunctions.js'
import { DAMAGE_COLORS, FLASH_COLORS } from '../../colors.js'
import { flash } from '../../animations/simple.js'
import LoadoutRow from '../pages/adventurerEdit/loadoutRow.js'
import EffectRow from '../effects/effectRow.js'
import { ICON_SVGS } from '../../assetLoader.js'
import AdventurerInstance from '../../../../game/adventurerInstance.js'
import AdventurerLoadout from '../adventurer/adventurerLoadout.js'
import MonsterLoadout from '../monster/monsterLoadout.js'

const HTML = `
<div class="name"></div>
<di-orb-row class="fighter-orbs displaynone"></di-orb-row>
<div class="absolute-full-size fill-contents standard-contents">
  <div class="flex-rows top-section flex-grow">
    <di-hp-bar></di-hp-bar>
    <di-stats-list></di-stats-list>
    <di-effects-list></di-effects-list>
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
      forced: ['physPower','magicPower'] // Excluded takes priority, so these might be hidden
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
    // this.effectsListEl.setFighterInstance(fighterInstance)
    this._update(false)
    return this
  }

  setState(newState, cancelAnimations = false){
    this.fighterInstance.setState(newState)
    this._update(cancelAnimations)
    return this
  }

  advanceTime(ms){
    if(this.fighterInstance.inCombat && !this.fighterInstance.mods.contains('freezeActionBar')){
      this._actionBarEl.advanceTime(ms)
    }
    // if(!this.fighterInstance.mods.contains('freezeCooldown')){
    //   this.loadoutEl.advanceTime(ms)
    // }
    // this.effectsListEl.advanceTime(ms)
  }

  displayActionPerformed(action){
    if(action.actionDef.type === 'attack'){
      if(action.actionDef.basic){
        const color = DAMAGE_COLORS[this.fighterInstance.basicAttackType]
        flash(this.basicAttackEl, color)
      }
    }
    // if(action.basicAttack){
    //   const color = DAMAGE_COLORS[this.fighterInstance.basicAttackType]
    //   flash(this.basicAttackEl, color)
    // }else if(action.effect){
    //   const effectEl = this._getEffectEl(action.effect)
    //   if(effectEl instanceof LoadoutRow){
    //     flash(effectEl, FLASH_COLORS[effectEl.loadoutItem.abilityDisplayInfo.type], 500)
    //   }else if(effectEl instanceof EffectRow){
    //     effectEl.flash()
    //   }
    // }
  }

  displayResult(result, sourceEffect){
    if(result.damageInfo){
      this._queueHpChange(() => this._displayDamageResult(result))
    }
    // if(result.type === 'attack'){
    // }else if(result.type === 'damage'){
    //   this._queueHpChange(() => this._displayDamageResult(result))
    // }else if(result.type === 'gainHealth'){
    //   this._queueHpChange(() => this._displayLifeGained(result.data.amount))
    // }else if(result.type === 'cancel'){
    //   this._displayCancellation(result, effect)
    // }
  }

  _displayLifeGained(amount){
    // if(!amount){
    //   return
    // }
    // new FlyingTextEffect(this.hpBarEl, amount, {
    //   fontSize: TEXT_EFFECT_MIN + Math.min(0.5, amount / this.fighterInstance.hpMax) * TEXT_EFFECT_MAX,
    //   clearExistingForSource: true
    // })
    // this.hpBarEl.setValue(amount, { relative: true, animate: true })
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

    for(let key in data.damageDistribution){
      if(data.damageDistribution[key] === 0){
        continue
      }
      let dmgStr = roundToFixed(data.damageDistribution[key], 2)
      let html = `<span class="${classes.join(' ')}">-${dmgStr}${data.crit ? '!!' : ''}</span>`
      let barEl = key === 'hp' ? this.hpBarEl : this._getEffectEl(key)?.barEl
      if(!barEl){
        continue
      }
      barEl.setValue(-data.damageDistribution[key], { relative: true, animate: true })
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

    if(this.fighterInstance.hp !== this.hpBarEl.value){
      if(cancelAnimations || (!this.hpBarEl.animating && this._hpChangeQueue.isEmpty)){
        this._hpChangeQueue.clear()
        this.hpBarEl.setValue(this.fighterInstance.hp)
      }
    }

    this.statsList.setOptions({
      excluded: this._excluded()
    })

    this.statsList.setStats(this.fighterInstance.stats, this.fighterInstance)
    // this.effectsListEl.update(cancelAnimations)
    this._updateActionBar()
    // this.loadoutEl.updateAllRows()
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
    const magicAttack = this.fighterInstance.mods.contains('magicAttack')
    const showPhys = this.fighterInstance.mods.contains('physScaling') ||
      this.fighterInstance.physPower !== this.fighterInstance.basePower
    const showMagic = this.fighterInstance.mods.contains('magicScaling') ||
      this.fighterInstance.magicPower !== this.fighterInstance.basePower

    if((showPhys || !magicAttack) && showMagic){
      return [...excluded]
    }else if(magicAttack && !showPhys){
      return [...excluded, 'physPower']
    }else{
      return [...excluded, 'magicPower']
    }
  }

  _getEffectEl(effectId, eventName){
    // if(!effectId){
    //   return null
    // }
    // const loadoutRow = this.loadoutEl._rows.find(el => {
    //   // TODO: eventName should have to be the main event for the effect
    //   return el.loadoutItem?.obj.effectId === effectId
    // })
    // if(loadoutRow){
    //   return loadoutRow
    // }
    // return [...this._effectsListEl.querySelectorAll('di-effect-row')].find(el => {
    //   return el.effect.effectId === effectId
    // })
  }

  _displayCancellation(result, effect){
    if(result.data?.cancelReason){
      const targetEl = this._getEffectEl(effect) ?? this.hpBarEl
      new FlyingTextEffect(
        targetEl,
        toDisplayName(result.data.cancelReason),
        {
          clearExistingForSource: true
        }
      )
    }
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

  _updateActionBar(){
    const type = this.fighterInstance.basicAttackType
    if(!this._actionBarEl.querySelector('.basic-attack-type-' + type)){
      this._actionBarEl.setBadge(`${ICON_SVGS[type + 'Power']}`)
    }
    this._actionBarEl.setTime(
      this.fighterInstance._state.timeSinceLastAction ?? 0,
      this.fighterInstance.timeUntilNextAction
    )
  }

  _setupLoadout(){
    const loadoutContainer = this.querySelector('.loadout-container')
    loadoutContainer.innerHTML = ''
    if(this.fighterInstance instanceof AdventurerInstance){
      loadoutContainer.appendChild(new AdventurerLoadout().setLoadout(this.fighterInstance.loadout))
    }else{
      loadoutContainer.appendChild(new MonsterLoadout().setLoadout(this.fighterInstance.loadout))
    }
  }
}

customElements.define('di-fighter-instance-pane', FighterInstancePane)

class ResultQueue{

  constructor(){
    this._queue = []
  }

  get isEmpty(){
    return this._queue.length ? false : true
  }

  add(fn){
    this._queue.push(fn)
    if(this._queue.length === 1){
      this._next()
    }
  }

  clear(){
    clearTimeout(this._timeout)
    this._queue = []
  }

  _next(){
    if(!this._queue.length){
      return
    }
    this._queue[0]()
    this._timeout = setTimeout(() => {
      this._queue = this._queue.slice(1)
      this._next()
    }, STAGGER_TIME)
  }
}