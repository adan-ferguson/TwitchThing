import { StatsDisplayStyle } from '../statsDisplayInfo.js'

const HTML = `
<div class="top">
  <div class="name"></div>
  <div class="subtitle description"></div>
</div>
<di-stats-list></di-stats-list>
`

export default class MonsterInfo extends HTMLElement{

  /**
   * @param monsterInstance {MonsterInstance}
   */
  constructor(monsterInstance){
    super()
    this.innerHTML = HTML
    this.querySelector('.name').textContent = monsterInstance.displayName
    this.querySelector('.description').textContent = monsterInstance.description

    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false,
        statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
        forced: ['physPower','speed','hpMax']
      })
      .setStats(monsterInstance.stats, monsterInstance)
  }
}

customElements.define('di-monster-info', MonsterInfo )