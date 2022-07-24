import { getAdventurerStats } from '../../../game/adventurer.js'
import BonusDetails from './pages/levelup/bonusDetails.js'
import classDisplayInfo from '../classDisplayInfo.js'
import Bonus from '../../../game/bonus.js'
import { wrap } from '../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { levelToXp, xpToLevel } from '../../../game/adventurer.js'

const HTML = `
<div class="flex-rows">
    <di-xp-bar></di-xp-bar>
    <div class="flex-columns">
        <di-stats-list></di-stats-list>
        <div class="divider"></div>
        <div class="bonuses-list"></div>
    </div>
</div>
`

const BONUS_HTML = (lvl, icon, name) => `
<span>${lvl}. ${name}</span><img src="${icon}">
`

export default class AdventurerInfo extends HTMLElement{

  /**
   * @param adventurer
   * @param stats {Stats} Provide this if they can't be derived from the adventurer itself, like
   *  if their loadout is being edited or if they have a state.
   */
  constructor(adventurer, stats = null){
    super()
    this.innerHTML = HTML
    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false
      })
      .setStats(stats || getAdventurerStats(adventurer))
    this._setBonuses(adventurer.bonuses)
    this.querySelector('di-xp-bar')
      .setLevelFunctions(xpToLevel, levelToXp)
      .setValue(adventurer.xp)
  }

  _setBonuses(bonuses){
    const bonusesList = this.querySelector('.bonuses-list')
    bonuses.forEach(bonusDef => {
      const bonus = new Bonus(bonusDef)
      const info = classDisplayInfo(bonus.group)
      const item = wrap(BONUS_HTML(bonusDef.level, info.orbIcon, bonus.displayName), {
        allowHTML: true,
        classes: ['bonus-item', 'flex-columns']
      })
      item.style.color = info.color
      tippy(item, {
        theme: 'light',
        allowHTML: true,
        content: new BonusDetails(bonusDef)
      })
      bonusesList.appendChild(item)
    })
  }
}

customElements.define('di-adventurer-info', AdventurerInfo )