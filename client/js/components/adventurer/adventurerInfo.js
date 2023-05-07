import classDisplayInfo from '../../displayInfo/classDisplayInfo.js'
import { wrapContent } from '../../../../game/utilFunctions.js'
import tippy from 'tippy.js'
import { StatsDisplayStyle } from '../../displayInfo/statsDisplayInfo.js'
import { advLevelToXp, advXpToLevel } from '../../../../game/adventurer.js'
import EffectDetails from '../effectDetails.js'

const HTML = `
<div class="flex-rows">
    <div class="name"></div>
    <di-xp-bar></di-xp-bar>
    <div class="flex-columns">
        <di-stats-list></di-stats-list>
        <div class="divider"></div>
        <div class="bonuses-list">Put split loadout here</div>
    </div>
</div>
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

    this.querySelector('di-xp-bar')
      .setLevelFunctions(advXpToLevel, advLevelToXp)
      .setValue(adventurerInstance.fighterData.xp)
  }
}

customElements.define('di-adventurer-info', AdventurerInfo )