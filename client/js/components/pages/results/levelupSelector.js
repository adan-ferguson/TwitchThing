import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'
import Stats from '../../../../../game/stats/stats.js'
import StatsList from '../../stats/statsList.js'

const HTML = `
<div>
    <span class="name"></span> has reached Level <span class="level"></span>
</div>
<di-stats-list></di-stats-list>
<div class="options"></div>
`

export default class LevelupSelector extends HTMLElement{
  constructor(){
    super()
    this.innerHTML = HTML
    this.statsList = this.querySelector('di-stats-list')
    this.statsList.setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL,
      inline: true
    })
    this.options = this.querySelector('.options')
    this._levelupStats = null
    this._selectedStats = null
  }

  get extraStats(){
    const affectors = []
    if(this._levelupStats){
      affectors.push(...this._levelupStats.affectors)
    }
    if(this._selectedStats){
      affectors.push(...this._selectedStats.affectors)
    }
    return affectors
  }

  setData(adventurer, levelup, callback){
    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = levelup.level

    const stats = new Stats(levelup.stats)
    this.statsList.setStats(stats)
    this._levelupStats = stats

    const options = levelup.options

    Object.keys(options).forEach((category) => {

      const optionEl = document.createElement('button')
      optionEl.classList.add('option')

      const stats = new Stats(options[category])
      const statsList = new StatsList()
      statsList.setOptions({
        statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
      })
      statsList.setStats(stats)
      optionEl.append(statsList)

      optionEl.addEventListener('click', () => {
        this.querySelectorAll('button').forEach(button => button.classList.remove('selected'))
        optionEl.classList.add('selected')
        this._selectedStats = stats
        callback(category)
      })

      this.options.appendChild(optionEl)
    })
  }
}

customElements.define('di-adventurer-levelup-selector', LevelupSelector)