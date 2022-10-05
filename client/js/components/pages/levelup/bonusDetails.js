import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'
import classDisplayInfo from '../../../classDisplayInfo.js'
import { OrbsDisplayStyle } from '../../orbRow.js'
import BonusInstance from '../../../../../game/bonusInstance.js'

const HTML = (name, description) => `
<div class="header">
    <div class="name">${name}</div>
    <div class="description">${description}</div>
</div>
<di-stats-list></di-stats-list>
<di-orb-row></di-orb-row>
`

export default class BonusDetails extends HTMLElement{

  constructor(bonusDef){
    super()
    const bonus = new BonusInstance(bonusDef)
    const classInfo = classDisplayInfo(bonus.group)
    this.innerHTML = HTML(bonus.displayName, bonus.description)

    const statsList = this.querySelector('di-stats-list')
    statsList.setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    statsList.setStats(bonus.stats)
    this.style.color = classInfo.color

    const orbRow = this.querySelector('di-orb-row')
    orbRow.setOptions({
      style: OrbsDisplayStyle.MAX_ONLY
    })
    orbRow.setData(bonus.orbsData)
  }
}

customElements.define('di-bonus-details', BonusDetails)