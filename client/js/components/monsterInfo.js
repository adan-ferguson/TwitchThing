import { getMonsterStats } from '../../../game/monster.js'
import { StatsDisplayStyle } from '../statsDisplayInfo.js'
import { toDisplayName } from '../../../game/utilFunctions.js'
import FighterInstance from '../../../game/combat/fighterInstance.js'

const HTML = `
<div class="name"></div>
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
    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false,
        statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
        forced: ['physPower']
      })
      .setStats(stats || getMonsterStats(monster), new FighterInstance(monster, stats))
  }
}

customElements.define('di-monster-info', MonsterInfo )