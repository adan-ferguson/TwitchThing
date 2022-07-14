import StatRow from './statRow.js'
import { getStatDisplayInfo, scopesMatch, StatsDisplayScope, StatsDisplayStyle } from '../../statsDisplayInfo.js'

export default class StatsList extends HTMLElement{

  _options = {
    statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
    statsDisplayScope: StatsDisplayScope.ALL,
    forcedStats: [],
    showTooltips: true
  }

  constructor(){
    super()
  }

  setOptions(options){
    for (let key in options){
      if(key in this._options){
        this._options[key] = options[key]
      }
    }
  }

  setStats(stats, owner = null){

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = stats.getAll(this._options.forcedStats)

    let hasIcon = false
    for(let key in statsToShow){
      const { rowHasIcon, visible = false } = this._updateStat(statsToShow[key], owner)
      if(visible && rowHasIcon){
        hasIcon = true
      }
      delete unusedStats[key]
    }

    Object.values(unusedStats).forEach(
      /** @param row {Node} */
      (row) => {
        this.removeChild(row)
      }
    )

    this.classList.toggle('no-icons', !hasIcon)
  }

  _updateStat(stat, owner = null){
    const statDisplayInfo = getStatDisplayInfo(stat, {
      owner,
      style: this._options.statsDisplayStyle
    })
    if(!scopesMatch(statDisplayInfo.scope, this._options.statsDisplayScope)){
      return {}
    }
    const row = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    if(!row){
      this.appendChild(new StatRow(statDisplayInfo, {
        showTooltips: this._options.showTooltips
      }))
    }else{
      row.setStatsDisplayInfo(statDisplayInfo)
    }
    return { visible: true, rowHasIcon: statDisplayInfo.icon ? true : false }
  }
}

customElements.define('di-stats-list', StatsList)