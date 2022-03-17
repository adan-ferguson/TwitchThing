import StatRow from './statRow.js'

export default class StatsList extends HTMLElement{

  constructor(){
    super()
    this.rowOptions = {}
  }

  setRowOptions(options){
    for (let key in options){
      this.rowOptions[key] = options[key]
    }
  }

  setStats(stats){
    const statsToShow = stats.getAll()
    for(let key in statsToShow){
      this._updateStat(statsToShow[key])
    }
  }

  _updateStat(stat){
    const row  = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    if(!row){
      this.appendChild(new StatRow(stat, this.rowOptions))
    }else{
      row.update(stat)
    }
  }
}

customElements.define('di-stats-list', StatsList)