import * as AnimationHelper from '../../animationHelper.js'

const HTML = `
<div>
    <span class="name"></span> has reached level <span class="level"></span>
</div>
<div class="stats"></div>
<div class="options"></div>
`

const OPTION_HTML = option => `
+<span class="value">${option.value}</span> <span class="type">${option.type}</span>
`

export default class LevelupSelector extends HTMLElement{
  constructor() {
    super()
    this.innerHTML = HTML
    this.stats = this.querySelector('.stats')
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

    this.stats.innerHTML = ''
    this.options.innerHTML = ''
    this.querySelector('.level').textContent = nextLevelup.level

    nextLevelup.stats.forEach(stat => {
      const statEl = document.createElement('div')
      statEl.innerHTML = OPTION_HTML(stat)
      this.stats.appendChild(statEl)
    })

    nextLevelup.options.forEach((option, i) => {
      const optionEl = document.createElement('button')
      optionEl.classList.add('option')
      optionEl.innerHTML = OPTION_HTML(option)
      optionEl.addEventListener('click', () => {
        this._selectOption(i)
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