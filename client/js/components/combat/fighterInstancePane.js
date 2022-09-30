import AdventurerInstance from '../../../../game/adventurerInstance.js'
import { OrbsDisplayStyle } from '../orbRow.js'
import Modal from '../modal.js'
import AdventurerInfo from '../adventurer/adventurerInfo.js'
import MonsterInfo from '../monsterInfo.js'
import FlyingTextEffect from '../visualEffects/flyingTextEffect.js'
import { all as Mods } from '../../../../game/mods/combined.js'
import CustomAnimation from '../../customAnimation.js'
import { mergeOptionsObjects } from '../../../../game/utilFunctions.js'
import { flash } from '../../animationHelper.js'

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

const FLASH_COLORS = {
  attack: '#9fff9f',
  active: '#71e1e5',
  triggered: '#ffa227'
}

export default class FighterInstancePane extends HTMLElement{

  _orbRowEl
  _hpBarEl
  _loadoutEl
  _effectsListEl

  _options = {
    fadeOutOnDefeat: true,
  }

  constructor(){
    super()
    this.classList.add('flex-rows')
    this.innerHTML = HTML
    this._hpBarEl = this.querySelector('di-hp-bar')
    this._actionBarEl = this.querySelector('di-action-bar')
    this._loadoutEl = this.querySelector('di-loadout')
    this._orbRowEl = this.querySelector('.fighter-orbs').setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    this.statsList = this.querySelector('di-stats-list').setOptions({
      iconsOnly: true,
      excluded: ['hpMax','speed']
    })
    this._effectsListEl = this.querySelector('di-effects-list')

    this.querySelector('.top-section').addEventListener('click', e => {
      this._showFighterInfoModal()
    })
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

  displayActionPerformed(ability, results){
    if(ability === 'basicAttack'){
      const statEl = this.statsList.querySelector(`di-stat-row[stat-key="${this.fighterInstance.basicAttackType}Power"]`)
      if(statEl){
        flash(statEl, FLASH_COLORS.active, 500)
      }
      return
    }
    const loadoutRow = this._loadoutEl.getRow(ability)
    if(loadoutRow){
      flash(loadoutRow, FLASH_COLORS[loadoutRow.loadoutItem.abilityState.type], 500)
    }
  }

  displayResult(result){
    if(result.resultType === 'dodge'){
      this._displayDodge()
    }else if(result.resultType === 'damage'){
      this._displayDamageResult(result)
    }else if(result.resultType === 'gainHealth'){
      this._displayLifeGained(result.amount)
    }
  }

  _displayLifeGained(amount){
    new FlyingTextEffect(this._hpBarEl, amount)
  }

  _displayDodge(){
    new FlyingTextEffect(this._hpBarEl, 'Dodged!')
  }

  _displayDamageResult(damageResult){

    const classes = ['damage']
    if(damageResult.crit){
      classes.push('crit')
    }
    if(damageResult.damageType === 'magic'){
      classes.push('magic')
    }
    let html = `<span class="${classes.join(' ')}">-${damageResult.finalDamage}${damageResult.crit ? '!!' : ''}</span>`

    if(damageResult.blocked){
      html += `<span class="blocked">(${damageResult.blocked} blocked)</span>`
    }

    new FlyingTextEffect(this._hpBarEl, html, {
      html: true
    })
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

    this._hpBarEl.setOptions({ max: this.fighterInstance.hpMax })

    if(this.fighterInstance.hp !== this._hpBarEl.value){
      if(animate){
        this._hpBarEl.setValue(this.fighterInstance.hp, {
          animate: true
        })
      }else{
        this._hpBarEl.setValue(this.fighterInstance.hp)
      }
    }

    const isMagic = this.fighterInstance.mods.contains(Mods.magicAttack) ?  true : false
    if(!isMagic){
      this.statsList.setOptions({
        forced: ['physPower']
      })
    }

    console.log('incombat', this.fighterInstance.inCombat)
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
}

customElements.define('di-fighter-instance-pane', FighterInstancePane )