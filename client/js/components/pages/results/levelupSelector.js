import * as AnimationHelper from '../../../animationHelper.js'
import StatRow from '../../stats/statRow.js'
import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'
import Stats from '../../../../../game/stats/stats.js'
import StatsList from '../../stats/statsList.js'

const HTML = `
<div>
    <span class="name"></span> has reached level <span class="level"></span>
</div>
<di-stats-list></di-stats-list>
<div>Select A Bonus:</div>
<div class="options"></div>
`

export default class LevelupSelector extends HTMLElement{
  constructor(){
    super()
    this.innerHTML = HTML
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setRowOptions({
      style: StatsDisplayStyle.ADDITIONAL
    })
    this.options = this.querySelector('.options')
  }

  setLevelups(adventurer, levelups){
    this._selectedOptions = []
    this._levelups = levelups.slice()
    this.querySelector('.name').textContent = adventurer.name
    this._showNextLevelup()
  }

  async _showNextLevelup(){
    const nextLevelup = this._levelups.splice(0, 1)[0]

    this.options.innerHTML = ''
    this.querySelector('.level').textContent = nextLevelup.level

    const stats = new Stats(nextLevelup.stats)
    this.statsList.setStats(stats)

    Object.keys(nextLevelup.options).forEach((category) => {

      const options = nextLevelup.options[category]

      const optionEl = document.createElement('button')
      optionEl.classList.add('option')

      const stats = new Stats(options)
      const statsList = new StatsList()
      statsList.setRowOptions({
        style: StatsDisplayStyle.ADDITIONAL
      })
      statsList.setStats(stats)
      optionEl.append(statsList)

      optionEl.addEventListener('click', () => {
        this._selectOption(category)
      })

      this.options.appendChild(optionEl)
    })
  }

  _selectOption(i){
    this._selectedOptions.push(i)
    if(this._levelups.length){
      AnimationHelper.fadeOut(this).then(() => {
        this._showNextLevelup()
        AnimationHelper.fadeIn(this)
      })
    }else{
      const e = new CustomEvent('finished', {
        detail: {
          selectedBonuses: this._selectedOptions
        }
      })
      this.dispatchEvent(e)
    }
  }
}

customElements.define('di-adventurer-levelup-selector', LevelupSelector)