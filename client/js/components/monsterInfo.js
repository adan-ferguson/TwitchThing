import { getMonsterStats } from '../../../game/monster.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import { toDisplayName } from '../../../game/utilFunctions.js'
import FighterInstance from '../../../game/combat/fighterInstance.js'

const HTML = `
<div class="top">
  <div class="name"></div>
  <div class="subtitle description"></div>
</div>
<di-stats-list></di-stats-list>
`

export default class MonsterInfo extends HTMLElement{

  /**
   * @param monster
   * @param stats Provide this if they can't be derived from the adventurer itself, like
   *  if their loadout is being edited or if they have a state.
   */
  constructor(monster, stats = null){
    super()
    this.innerHTML = HTML
    this.querySelector('.name').textContent = toDisplayName(monster.name)
    if(monster.description){
      this.querySelector('.description').textContent = monster.description
    }
    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false,
        statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
        forced: ['physPower','speed','hpMax']
      })
      .setStats(stats || getMonsterStats(monster), new FighterInstance(monster, stats))
  }
}

customElements.define('di-monster-info', MonsterInfo )