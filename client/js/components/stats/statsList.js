import StatRow from './statRow.js'
import { getStatDisplayInfo, scopesMatch, StatsDisplayScope, StatsDisplayStyle } from '../../statsDisplayInfo.js'

export default class StatsList extends HTMLElement{

  constructor(){
    super()
    this.options = {
      statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
      statsDisplayScope: StatsDisplayScope.ALL,
      forcedStats: []
    }
  }

  setOptions(options){
    for (let key in options){
      if(key in this.options){
        this.options[key] = options[key]
      }
    }
  }

  setStats(stats, owner = null){

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = stats.getAll(this.options.forcedStats)

    for(let key in statsToShow){
      this._updateStat(statsToShow[key], owner)
      delete unusedStats[key]
    }

    Object.values(unusedStats).forEach(
      /** @param row {Node} */
      (row) => {
        this.removeChild(row)
      }
    )
  }

  _updateStat(stat, owner = null){
    const statDisplayInfo = getStatDisplayInfo(stat, {
      owner,
      style: this.options.statsDisplayStyle
    })
    if(!scopesMatch(statDisplayInfo.scope, this.options.statsDisplayScope)){
      return
    }
    const row = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    if(!row){
      this.appendChild(new StatRow(statDisplayInfo))
    }else{
      row.update(statDisplayInfo)
    }
  }
}

customElements.define('di-stats-list', StatsList)