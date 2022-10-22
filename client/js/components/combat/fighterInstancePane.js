import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import Modal from '../modal.js'
import AdventurerInfo from '../adventurer/adventurerInfo.js'
import MonsterInfo from '../monsterInfo.js'
import FlyingTextEffect from '../visualEffects/flyingTextEffect.js'
import CustomAnimation from '../../animations/customAnimation.js'
import { mergeOptionsObjects, roundToFixed } from '../../../../game/utilFunctions.js'
import { magicAttackMod, magicScalingMod, physScalingMod } from '../../../../game/mods/combined.js'
import { DAMAGE_COLORS, FLASH_COLORS } from '../../colors.js'
import { flash } from '../../animations/simple.js'
import LoadoutRow from '../loadout/loadoutRow.js'
import EffectRow from '../effects/effectRow.js'

const HTML = `
<div class="name"></div>
<div class="flex-rows top-section flex-grow">
  <di-hp-bar></di-hp-bar>
  <di-action-bar></di-action-bar>
  <di-stats-list></di-stats-list>
  <di-effects-list></di-effects-list>
  <di-orb-row class="fighter-orbs"></di-orb-row>
</div>
<di-loadout></di-loadout>
`

const TEXT_EFFECT_MIN = 0.9
const TEXT_EFFECT_MAX = 2.1

export default class FighterInstancePane extends HTMLElement{

  _orbRowEl
  _loadoutEl
  _effectsListEl
  _options = {
    fadeOutOnDefeat: true,
  }

  hpBarEl

  constructor(){
    super()
    this.classList.add('flex-rows')
    this.innerHTML = HTML
    this.hpBarEl = this.querySelector('di-hp-bar')
    this._actionBarEl = this.querySelector('di-action-bar')
    this._loadoutEl = this.querySelector('di-loadout')
    this._orbRowEl = this.querySelector('.fighter-orbs').setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    this.statsList = this.querySelector('di-stats-list').setOptions({
      iconsOnly: true,
      forced: ['physPower','magicPower'] // Excluded takes priority, so these might be hidden
    })
    this._effectsListEl = this.querySelector('di-effects-list')

    this.querySelector('.top-section').addEventListener('click', e => {
      this._showFighterInfoModal()
    })
  }

  get basicAttackStatEl(){
    return this.statsList.querySelector(`di-stat-row[stat-key="${this.fighterInstance.basicAttackType}Power"]`)
  }

  setOptions(options){
    this._options = mergeOptionsObjects(this._options, options)
    return this
  }

  setFighter(fighterInstance){
    this.fighterInstance = fighterInstance
    this._loadoutEl.setFighterInstance(fighterInstance)
    this.querySelector('.name').textContent = fighterInstance.displayName
    this._orbRowEl.setData(fighterInstance.orbs)
    this._effectsListEl.setFighterInstance(fighterInstance)
    this._update(false)
    return this
  }

  setState(newState, animate = false){
    this.fighterInstance.setState(newState)
    this._update(animate)
    return this
  }

  advanceTime(ms){
    this.fighterInstance.advanceTime(ms)
    this._updateCooldowns()
  }

  displayActionPerformed(action){
    if(action.basicAttack){
      const color = DAMAGE_COLORS[this.fighterInstance.basicAttackType]
      flash(this.basicAttackStatEl, color)
    }else{
      const effectEl = this._getEffectEl(action.effect)
      if(effectEl instanceof LoadoutRow){
        flash(effectEl, FLASH_COLORS[effectEl.loadoutItem.abilityStateInfo.type], 500)
      }else if(effectEl instanceof EffectRow){
        effectEl.flash()
      }
    }
  }

  displayResult(result){
    if(result.type === 'attack'){
      this._displayAttackResult(result)
    }else if(result.type === 'damage'){
      this._displayDamageResult(result)
    }else if(result.type === 'gainHealth'){
      this._displayLifeGained(result.data.amount)
    }
  }

  _displayLifeGained(amount){
    if(!amount){
      return
    }
    new FlyingTextEffect(this.hpBarEl, amount, {
      fontSize: TEXT_EFFECT_MIN + Math.min(0.5, amount / this.fighterInstance.hpMax) * TEXT_EFFECT_MAX
    })
  }

  _displayAttackResult(result){
    if(result.cancelled){
      if(result.cancelled !== true){
        // Sort of hacky, if result.cancelled is a string, that's the non-effect
        // reason for cancellation, so like a dodge or miss.
        new FlyingTextEffect(this.hpBarEl, makeExciting(result.cancelled))
      }else{
        const cancellerEvent = result.triggeredEvents.find(event => event.cancelled)
        if(cancellerEvent){
          const cancellerResult = cancellerEvent.results.find(result => result.cancelled)
          new FlyingTextEffect(
            this._getEffectEl(cancellerEvent.effect),
            makeExciting(cancellerResult.data.reason)
          )
        }
      }
    }else{
      this._displayDamageResult(result)
    }
  }

  _displayDamageResult(damageResult){

    const data = damageResult.data
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
      let el = key === 'hp' ? this.hpBarEl : this._getEffectEl(key)
      if(!el){
        continue
      }
      new FlyingTextEffect(el, html, {
        html: true,
        fontSize: TEXT_EFFECT_MIN + Math.min(0.5, dmgStr / this.fighterInstance.hpMax) * TEXT_EFFECT_MAX
      })
    }

    if(data.blocked){
      const blockedHtml = `<span class="blocked">[${data.blocked}]</span>`
      const statEl = this.statsList.querySelector(`di-stat-row[stat-key=${data.damageType}Def]`)
      if(statEl){
        new FlyingTextEffect(statEl, blockedHtml, {
          html: true
        })
      }
    }
  }

  _update(animate = false){

    if(this._finished){
      if(this.fighterInstance.hp){
        this._fadeAnim.cancel()
        this._finished = false
        this.style.opacity = '1'
      }else{
        return
      }
    }

    this.hpBarEl.setOptions({ max: this.fighterInstance.hpMax })

    if(this.fighterInstance.hp !== this.hpBarEl.value){
      if(animate){
        this.hpBarEl.setValue(this.fighterInstance.hp, {
          animate: true
        })
      }else{
        this.hpBarEl.setValue(this.fighterInstance.hp)
      }
    }

    this.statsList.setOptions({
      excluded: this._excluded()
    })

    this._actionBarEl.classList.toggle('displaynone', !this.fighterInstance.inCombat)
    this.statsList.setStats(this.fighterInstance.stats, this.fighterInstance)
    this._effectsListEl.update()
    this._updateCooldowns()

    if(!this.fighterInstance.hp && this._options.fadeOutOnDefeat){
      this._fadeAnim = new CustomAnimation({
        duration: 1200,
        tick: pct => {
          this.style.opacity = (1 - pct).toString()
        }
      })
      this._finished = true
    }
  }

  _updateCooldowns(){
    this._actionBarEl.setTime(
      this.fighterInstance._state.timeSinceLastAction,
      this.fighterInstance.timeUntilNextAction
    )
    this._loadoutEl.updateAllRows()
    this._effectsListEl.updateDurations()
  }

  _showFighterInfoModal(){
    const modal = new Modal()
    if(this.fighterInstance instanceof AdventurerInstance){
      modal.innerPane.appendChild(new AdventurerInfo(this.fighterInstance))
    }else{
      modal.innerPane.appendChild(new MonsterInfo(this.fighterInstance))
    }
    modal.show()
  }

  _excluded(){
    const excluded = ['hpMax','speed']
    const magicAttack = this.fighterInstance.mods.contains(magicAttackMod)
    const showPhys = this.fighterInstance.mods.contains(physScalingMod)
    const showMagic = this.fighterInstance.mods.contains(magicScalingMod)
    if((showPhys || !magicAttack) && showMagic){
      return [...excluded]
    }else if(magicAttack && !showPhys){
      return [...excluded, 'physPower']
    }else{
      return [...excluded, 'magicPower']
    }
  }

  _getEffectEl(effectId, eventName){
    const loadoutRow = this._loadoutEl._rows.find(el => {
      // TODO: eventName should have to be the main event for the effect
      return el.loadoutItem?.obj.effectId === effectId
    })
    if(loadoutRow){
      return loadoutRow
    }
    return [...this._effectsListEl.querySelectorAll('di-effect-row')].find(el => {
      return el.effect.effectId === effectId
    })
  }
}

customElements.define('di-fighter-instance-pane', FighterInstancePane )

function makeExciting(str){
  return str.slice(0,1).toUpperCase() + str.slice(1) + '!'
}