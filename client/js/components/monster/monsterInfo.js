import { StatsDisplayStyle } from '../../displayInfo/statsDisplayInfo.js'

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
    this.querySelector('.description').textContent = monsterInstance.xpReward + ' xp'

    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false,
        statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
        forced: ['physPower','speed','hpMax']
      })

    this._monsterInstance = monsterInstance
    this.update()
  }

  update(){
    this.querySelector('di-stats-list').setStats(this._monsterInstance.stats)
  }
}

customElements.define('di-monster-info', MonsterInfo )