import StatRow from './statRow.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../../statsDisplayInfo.js'
import Stats from '../../../../game/stats/stats.js'
import { wait } from '../../../../game/utilFunctions.js'
import { flash } from '../../animationHelper.js'

const STAT_INCREASE_COLOR = '#c0ffc0'
const STAT_DECREASE_COLOR = '#fabcbc'
const STAT_EFFECT_TIME = 500

export default class StatsList extends HTMLElement{

  _options = {
    statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
    iconsOnly: false,
    showTooltips: true,
    truncate: true,
    maxItems: 999,
    forced: [],
    excluded: []
  }

  _stats = new Stats()
  _owner = null

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

  setStats(stats, owner = null, showStatChangeEffect = false){
    // TODO: options
    this._stats = stats
    this._owner = owner
    this._update(showStatChangeEffect)
  }

  async _update(showStatChangeEffect = false){

    this.classList.toggle('icons-only', this._options.iconsOnly)

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = this._stats.getAll(this._options.forced)

    for(let key in statsToShow){
      if(this._options.excluded.indexOf(key) > -1){
        continue
      }
      this._updateStat(statsToShow[key], this._owner, showStatChangeEffect)
      delete unusedStats[key]
    }

    await this._removeUnused(Object.values(unusedStats), showStatChangeEffect)

    this.classList.toggle('no-icons', this.querySelector('img') ? false : true)

    const rows = this.querySelectorAll('di-stat-row')
    rows.forEach((el, i) => {
      el.classList.toggle('max-items-hidden', i >= this._options.maxItems)
    })
    this.classList.toggle('show-ellipsis', rows.length > this._options.maxItems)
  }

  _updateStat(stat, owner = null, showStatChangeEffect = false){
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
      const diff = parseFloat(statDisplayInfo.displayedValue) - parseFloat(row.statsDisplayInfo.displayedValue)
      if(showStatChangeEffect && diff){
        const flip = (statDisplayInfo.displayInverted || statDisplayInfo.stat.inverted) ? -1 : 1
        const color = flip * diff > 0 ? STAT_INCREASE_COLOR : STAT_DECREASE_COLOR
        flash(row, color, STAT_EFFECT_TIME)
      }
      row.setStatsDisplayInfo(statDisplayInfo)
    }
  }

  async _removeUnused(rows, showStatChangeEffect = false){
    if(!rows.length){
      return
    }
    if(showStatChangeEffect){
      rows.forEach(r => flash(r, STAT_DECREASE_COLOR, STAT_EFFECT_TIME))
      await wait(STAT_EFFECT_TIME)
    }
    rows.forEach(r => r.remove())
  }
}

customElements.define('di-stats-list', StatsList)