import classDisplayInfo from '../../classDisplayInfo.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { StatsDisplayStyle } from '../../statsDisplayInfo.js'
import { advLevelToXp, advXpToLevel } from '../../../../game/adventurerInstance.js'
import EffectDetails from '../effectDetails.js'

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

const BONUS_HTML = (level, icon, name) => `
<span class="name">${name}</span>
<span>
  ${icon}<span>${level}</span>
</span>
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

    this._setBonuses(adventurerInstance.bonusesData)
    this.querySelector('di-xp-bar')
      .setLevelFunctions(advXpToLevel, advLevelToXp)
      .setValue(adventurerInstance.fighterData.xp)
  }

  _setBonuses(bonusesData){
    const bonusesList = this.querySelector('.bonuses-list')

    bonusesData.instances.forEach(bonusInstance => {
      const info = classDisplayInfo(bonusInstance.group)
      const item = wrapContent(BONUS_HTML(bonusInstance.level, info.icon, bonusInstance.displayName), {
        allowHTML: true,
        class: ['bonus-item', 'flex-columns']
      })
      item.style.color = info.color
      tippy(item, {
        theme: 'light',
        allowHTML: true,
        content: new EffectDetails().setEffect(bonusInstance)
      })
      bonusesList.appendChild(item)
    })
  }
}

customElements.define('di-adventurer-info', AdventurerInfo )