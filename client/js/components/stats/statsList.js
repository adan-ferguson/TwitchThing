import StatRow from './statRow.js'
import { getStatDisplayInfo, StatsDisplayStyle } from '../../displayInfo/statsDisplayInfo.js'
import Stats from '../../../../game/stats/stats.js'
import { mergeOptionsObjects, wait } from '../../../../game/utilFunctions.js'
import { flash } from '../../animations/simple.js'
import _ from 'lodash'
import DIElement from '../diElement.js'

const STAT_INCREASE_COLOR = '#c0ffc0'
const STAT_DECREASE_COLOR = '#fabcbc'
const STAT_EFFECT_TIME = 500

export default class StatsList extends DIElement{

  get defaultOptions(){
    return {
      stats: new Stats(),
      owner: null,
      statsDisplayStyle: StatsDisplayStyle.CUMULATIVE,
      iconsOnly: false,
      showTooltips: true,
      truncate: true,
      maxItems: 999,
      hideIfDefaultValue: false,
      forced: [],
      excluded: []
    }
  }

  get stats(){
    return this._options.stats
  }

  get empty(){
    return this.querySelector('di-stat-row') ? false : true
  }

  setStats(stats, showStatChangeEffect = false){
    this._options.stats = stats
    this._update(showStatChangeEffect)
    return this
  }

  async _update(showStatChangeEffect = false){

    this.classList.toggle('icons-only', this._options.iconsOnly)

    const unusedStats = {}
    this.querySelectorAll('di-stat-row').forEach(row => {
      unusedStats[row.getAttribute('stat-key')] = row
    })

    const statsToShow = this._options.stats.getAll(this._options.forced)

    for(let key in statsToShow){
      const stat = statsToShow[key]
      if(this._options.excluded.indexOf(key) > -1){
        continue
      }
      if(this._options.hideIfDefaultValue && stat.value === stat.defaultValue){
        continue
      }
      this._updateStat(stat, this._options.owner, showStatChangeEffect)
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
    if(!statDisplayInfo || (this._options.iconsOnly && !statDisplayInfo.icon)){
      return
    }
    let row = this.querySelector(`di-stat-row[stat-key="${stat.name}"]`)
    let shouldFlash = showStatChangeEffect
    let flashColor = STAT_INCREASE_COLOR
    if(!row){
      row = new StatRow(statDisplayInfo, {
        showTooltips: this._options.showTooltips,
        iconsOnly: this._options.iconsOnly
      })
      this.appendChild(row)
    }else{
      const diff = parseFloat(statDisplayInfo.displayedValue) - parseFloat(row.statsDisplayInfo.displayedValue)
      const flip = (statDisplayInfo.displayInverted || statDisplayInfo.stat.inverted) ? -1 : 1
      row.setStatsDisplayInfo(statDisplayInfo)
      shouldFlash = shouldFlash && diff
      if(flip * diff < 0){
        flashColor = STAT_DECREASE_COLOR
      }
    }
    if(shouldFlash){
      flash(row, flashColor, STAT_EFFECT_TIME)
    }
  }

  async _removeUnused(rows, showStatChangeEffect = false){
    if(!rows.length){
      return
    }
    if(showStatChangeEffect){
      rows.forEach(r => flash(r, STAT_DECREASE_COLOR, STAT_EFFECT_TIME))
      await wait(10)
    }
    rows.forEach(r => r.remove())
  }
}

customElements.define('di-stats-list', StatsList)