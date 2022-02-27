import * as AnimationHelper from '../../../animationHelper.js'

const HTML = `
<div>
    <span class="name"></span> has reached level <span class="level"></span>
</div>
<div class="stats"></div>
<div>Select A Bonus:</div>
<div class="options"></div>
`

const STAT_HTML = (name, val)  => `
+<span class="value">${val}</span> <span class="type">${name}</span>
`

export default class LevelupSelector extends HTMLElement{
  constructor(){
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

    Object.entries(nextLevelup.stats).forEach(([key, val]) => {
      this.stats.appendChild(makeStatDescription(key, val))
    })

    nextLevelup.options.forEach((option, i) => {
      const optionEl = document.createElement('button')
      optionEl.classList.add('option')
      Object.entries(option).forEach(([key, val]) => {
        optionEl.appendChild(makeStatDescription(key, val))
      })
      optionEl.addEventListener('click', () => {
        this._selectOption(i)
      })
      this.options.appendChild(optionEl)
    })

    function makeStatDescription(key, val){
      const optionEl = document.createElement('div')
      optionEl.innerHTML = STAT_HTML(key, val)
      return optionEl
    }
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