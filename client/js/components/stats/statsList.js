import StatRow from './statRow.js'
import { getStatDisplayInfo, scopesMatch, StatsDisplayScope, StatsDisplayStyle } from '../../statsDisplayInfo.js'

export default class StatsList extends HTMLElement{

  constructor(){
    super()
    this.options = {
      statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
      statsDisplayScope: StatsDisplayScope.ALL,
      inline: false,
      noHP: false
    }
    this._update()
  }

  setOptions(options){
    for (let key in options){
      if(key in this.options){
        this.options[key] = options[key]
      }
    }
    this._update()
  }

  setStats(stats){

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = stats.getAll()
    for(let key in statsToShow){
      if(key === 'hpMax' && this.options.noHP){
        continue
      }
      this._updateStat(statsToShow[key])
      delete unusedStats[key]
    }

    Object.values(unusedStats).forEach(
      /** @param row {Node} */
      (row) => {
        this.removeChild(row)
      }
    )
  }

  _updateStat(stat){
    const statDisplayInfo = getStatDisplayInfo(stat, this.options.statsDisplayStyle)
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

  _update(){
    this.classList.toggle('inline', this.options.inline)
  }
}

customElements.define('di-stats-list', StatsList)