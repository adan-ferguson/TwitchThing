import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'
import { getBonusOrbsData, getBonusStats } from '../../../../../game/bonus.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'
import classDisplayInfo from '../../../classDisplayInfo.js'
import { OrbsDisplayStyle } from '../../orbRow.js'

const HTML = name => `
<div class="header">
    <div class="name">${name}</div>
</div>
<di-stats-list></di-stats-list>
<di-orb-row></di-orb-row>
`

export default class BonusDetails extends HTMLElement{

  constructor(bonus){
    super()
    const classInfo = classDisplayInfo(bonus.group)
    this.innerHTML = HTML(toDisplayName(bonus.name))

    const statsList = this.querySelector('di-stats-list')
    statsList.setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    statsList.setStats(getBonusStats(bonus))
    this.style.color = classInfo.color

    const orbRow = this.querySelector('di-orb-row')
    orbRow.setData(getBonusOrbsData(bonus), OrbsDisplayStyle.ADDITIVE)
  }
}

customElements.define('di-bonus-details', BonusDetails)