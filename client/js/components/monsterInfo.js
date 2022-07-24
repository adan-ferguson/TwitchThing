import { getMonsterStats } from '../../../game/monster.js'

const HTML = `
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
    this.querySelector('di-stats-list')
      .setOptions({
        truncate: false
      })
      .setStats(stats || getMonsterStats(monster))
  }
}

customElements.define('di-monster-info', MonsterInfo )