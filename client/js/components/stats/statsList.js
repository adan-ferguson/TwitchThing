import StatRow from './statRow.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../../statsDisplayInfo.js'
import Stats from '../../../../game/stats/stats.js'

export default class StatsList extends HTMLElement{

  _options = {
    statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
    iconsOnly: false,
    showTooltips: true,
    truncate: true,
    exclude: []
  }

  _stats = new Stats()
  _owner = null

  constructor(){
    super()
  }

  get stats(){
    return this._stats
  }

  setOptions(options){
    for (let key in options){
      if(key in this._options){
        this._options[key] = options[key]
      }
    }
    this._update()
    return this
  }

  setStats(stats, owner = null){
    this._stats = stats
    this._owner = owner
    this._update()
  }

  _update(){

    this.classList.toggle('icons-only', this._options.iconsOnly)

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = this._stats.getAll()

    for(let key in statsToShow){
      if(this._options.exclude.indexOf(key) > -1){
        continue
      }
      this._updateStat(statsToShow[key], this._owner)
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
      style: this._options.statsDisplayStyle
    })
    if(this._options.iconsOnly && !statDisplayInfo.icon){
      return
    }
    const row = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    if(!row){
      this.appendChild(new StatRow(statDisplayInfo, {
        showTooltips: this._options.showTooltips,
        iconsOnly: this._options.iconsOnly
      }))
    }else{
      row.setStatsDisplayInfo(statDisplayInfo)
    }
  }
}

customElements.define('di-stats-list', StatsList)