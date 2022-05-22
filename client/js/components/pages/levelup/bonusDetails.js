import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'
import StatsList from '../../stats/statsList.js'
import { getBonusOrbsData, getBonusStats } from '../../../../../game/bonus.js'

const HTML = `
<div class="name"></div>
<di-orb-row></di-orb-row>
<di-stats-list></di-stats-list>
`

export default class BonusDetails extends HTMLElement{

  constructor(bonus){
    super()
    this.innerHTML = HTML
    this.classList.add('clickable')

    this.querySelector('.name').textContent = bonus.name

    const orbRow = this.querySelector('di-orb-row')
    orbRow.setData(getBonusOrbsData(bonus))

    const statsList = this.querySelector('di-stats-list')
    statsList.setOptions({
      statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    })
    statsList.setStats(getBonusStats(bonus))
  }

  setData(adventurer, levelup){
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
        if(this.options.classList.contains('bonus-selected')){
          return
        }
        this.options.classList.add('bonus-selected')
        this.querySelectorAll('button').forEach(button => button.classList.remove('selected'))
        optionEl.classList.add('selected')
        this._selectedStats = stats
        this._cb(category)
      })

      this.options.appendChild(optionEl)
    })
  }

  awaitSelection(){
    return new Promise(res => {
      this._cb = res
    })
  }
}

customElements.define('di-bonus-details', BonusDetails)