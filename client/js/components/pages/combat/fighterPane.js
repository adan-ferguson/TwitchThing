import FighterInstance from '../../../../../game/fighterInstance.js'
import FlyingTextEffect from '../../effects/flyingTextEffect.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'
import { adventurerLoadoutContents } from '../../../adventurer.js'
import { monsterLoadoutContents } from '../../../monster.js'
import Modal from '../../modal.js'
import AdventurerInfo from '../../adventurer/adventurerInfo.js'
import MonsterInfo from '../../monsterInfo.js'
import CustomAnimation from '../../../customAnimation.js'
import { all as Mods } from '../../../../../game/mods/combined.js'
import { OrbsDisplayStyle } from '../../orbRow.js'
import { getAdventurerOrbsData } from '../../../../../game/adventurer.js'

const HTML = `
<div class="name"></div>
<div class="flex-grow flex-rows top-section">
  <di-hp-bar></di-hp-bar>
  <di-action-bar></di-action-bar>
  <di-stats-list></di-stats-list>
  <di-orb-row class="adventurer-orbs"></di-orb-row>
</div>   
<di-loadout></di-loadout>    
`

export default class FighterPane extends HTMLElement{

  fighter
  _orbRow

  constructor(){
    super()
    this.classList.add('content-well', 'flex-rows')
    this.innerHTML = HTML
    this._orbRow = this.querySelector('.adventurer-orbs').setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    this.hpBar = this.querySelector('di-hp-bar')
    this.actionBar = this.querySelector('di-action-bar')
    this.loadout = this.querySelector('di-loadout')
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      iconsOnly: true,
      excluded: ['hpMax','speed']
    })

    this.querySelector('.top-section').addEventListener('click', e => {
      if(this.fighter){
        this._showFighterInfoModal()
      }
    })
  }

  get isAdventurer(){
    // Monsters have mods, not items
    return this.fighter?.items ? true : false
  }

  /**
   * @param fighter {object} Value from fighter1 or fighter2 field in combat document
   */
  setFighter(fighter){
    this.fighter = fighter.data
    this.fighterId = fighter.id

    const fighterInstance = new FighterInstance(this.fighter)
    this.querySelector('.name').textContent = fighterInstance.displayName

    if(this.isAdventurer){
      this.loadout.setContents(adventurerLoadoutContents(this.fighter))
      this._orbRow.setData(getAdventurerOrbsData(this.fighter))
    }else{
      this.loadout.setContents(monsterLoadoutContents(this.fighter))
    }
  }

  setState(state = {}, animate = false){
    this.fighterInstance = new FighterInstance(this.fighter, state, this.fighterId)
    this._update(animate)
  }

  advanceTime(ms){
    this.fighterInstance.advanceTime(ms)
    this._updateCooldowns()
  }

  displayActionPerformed(ability){
    // if(action.actionType === 'attack'){
    //   if(action.lifesteal){
    //     this.displayLifeGained(result.lifesteal)
    //   }
    // }
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
    new FlyingTextEffect(this.hpBar, amount)
  }

  _displayDodge(){
    new FlyingTextEffect(this.hpBar, 'Dodged!')
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

    new FlyingTextEffect(this.hpBar, html, {
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

    this.hpBar.setOptions({ max: this.fighterInstance.hpMax })

    if(this.fighterInstance.hp !== this.hpBar.value){
      if(animate){
        this.hpBar.setValue(this.fighterInstance.hp, {
          animate: true
        })
      }else{
        this.hpBar.setValue(this.fighterInstance.hp)
      }
    }

    const isMagic = this.fighterInstance.mods.contains(Mods.magicAttack) ?  true : false
    if(!isMagic){
      this.statsList.setOptions({
        forced: ['physPower']
      })
    }
    this.statsList.setStats(this.fighterInstance.stats, this.fighterInstance)

    this._updateCooldowns()

    if(!this.fighterInstance.hp){
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
    this.actionBar.setTime(
      this.fighterInstance._currentState.timeSinceLastAction,
      this.fighterInstance.timeUntilNextAction
    )
    // TODO: update cooldowns for items and effects
  }

  _showFighterInfoModal(){
    const modal = new Modal()
    if(this.fighterInstance.isAdventurer){
      modal.innerPane.appendChild(new AdventurerInfo(this.fighterInstance.baseFighter, this.fighterInstance.stats))
    }else{
      modal.innerPane.appendChild(new MonsterInfo(this.fighterInstance.baseFighter, this.fighterInstance.stats))
    }
    modal.show()
  }
}

customElements.define('di-combat-fighter-pane', FighterPane )