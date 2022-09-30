import BonusDetails from '../pages/levelup/bonusDetails.js'
import classDisplayInfo from '../../classDisplayInfo.js'
import BonusInstance from '../../../../game/bonusInstance.js'
import { wrap } from '../../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { StatsDisplayStyle } from '../../statsDisplayInfo.js'

const HTML = `
<div class="flex-rows">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <div class="flex-columns">
        <di-stats-list></di-stats-list>
        <div class="divider"></div>
        <div class="bonuses-list"></div>
    </div>
</div>
`

const BONUS_HTML = (count, icon, name) => `
<img class="flex-no-grow" src="${icon}">
<span class="name">${name}</span>
<span class="flex-no-grow">${count > 1 ? 'x' + count : ''}</span>
`

export default class AdventurerInfo extends HTMLElement{

  /**
   * @param adventurerInstance
   */
  constructor(adventurerInstance){
    super()
    this.innerHTML = HTML
    this.querySelector('.name').textContent = adventurerInstance.displayName
    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false,
        statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
        forced: ['physPower','speed','hpMax']
      })
      .setStats(adventurerInstance.stats, adventurerInstance)

    this._setBonuses(adventurerInstance.baseFighterDef.bonuses)
    this.querySelector('di-xp-bar')
      .setLevelFunctions(advXpToLevel, advLevelToXp)
      .setValue(adventurerInstance.baseFighterDef.xp)
  }

  _setBonuses(bonuses){
    const bonusesList = this.querySelector('.bonuses-list')

    const conglomerated = {}
    bonuses.forEach(({ group, name }) => {
      if (!conglomerated[group]){
        conglomerated[group] = {}
      }
      if (!conglomerated[group][name]){
        conglomerated[group][name] = 0
      }
      conglomerated[group][name]++
    })

    Object.keys(conglomerated).forEach(group => {
      Object.keys(conglomerated[group]).forEach(name => {
        const bonus = new BonusInstance({ group, name })
        const info = classDisplayInfo(bonus.group)
        const item = wrap(BONUS_HTML(conglomerated[group][name], info.orbIcon, bonus.displayName), {
          allowHTML: true,
          class: ['bonus-item', 'flex-columns']
        })
        item.style.color = info.color
        tippy(item, {
          theme: 'light',
          allowHTML: true,
          content: new BonusDetails({ group, name })
        })
        bonusesList.appendChild(item)
      })
    })
  }
}

customElements.define('di-adventurer-info', AdventurerInfo )