import StatRow from './statRow.js'
import { StatsDisplayStyle } from '../../statsDisplayInfo.js'

export default class StatsList extends HTMLElement{

  constructor(){
    super()
    this.options = {
      statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
      inline: false
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
    const row = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    if(!row){
      this.appendChild(new StatRow(stat, { style: this.options.statsDisplayStyle }))
    }else{
      row.update(stat)
    }
  }

  _update(){
    this.classList.toggle('inline', this.options.inline)
  }
}

customElements.define('di-stats-list', StatsList)