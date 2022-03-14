import * as AnimationHelper from '../../../animationHelper.js'
import StatRow from '../../stats/statRow.js'
import { StatsDisplayStyle } from '../../../statsDisplayInfo.js'

const HTML = `
<div>
    <span class="name"></span> has reached level <span class="level"></span>
</div>
<div class="stats-list"></div>
<div>Select A Bonus:</div>
<div class="options"></div>
`

export default class LevelupSelector extends HTMLElement{
  constructor(){
    super()
    this.innerHTML = HTML
    this.statsList = this.querySelector('.stats-list')
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

    this.statsList.innerHTML = ''
    this.options.innerHTML = ''
    this.querySelector('.level').textContent = nextLevelup.level

    Object.entries(nextLevelup.stats).forEach(([key, val]) => {
      this.statsList.appendChild(StatRow.fromNameAndValue(key, val, {
        style: StatsDisplayStyle.ADDITIONAL
      }))
    })

    Object.keys(nextLevelup.options).forEach((category) => {

      const options = nextLevelup.options[category]

      const optionEl = document.createElement('button')
      optionEl.classList.add('option')

      const statsList = document.createElement('div')
      statsList.classList.add('stats-list')
      optionEl.appendChild(statsList)

      Object.entries(options).forEach(([key, val]) => {
        statsList.appendChild(
          this.statsList.appendChild(StatRow.fromNameAndValue(key, val, {
            style: StatsDisplayStyle.ADDITIONAL
          })))
      })

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