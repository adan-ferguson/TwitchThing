import Page from '../page.js'
import { fadeIn, fadeOut } from '../../../animations/simple.js'
import { hideLoader, showLoader } from '../../../loader.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import { makeEl } from '../../../../../game/utilFunctions.js'
import AdventurerInstance from '../../../../../game/adventurerInstance.js'

const HTML = `
<div class="content-rows">
  <div class="flex-rows flex-no-grow">
    <div class="text">Select a Bonus</div>
    <button class="reroll">Reroll</button>
  </div>
  <div class="options flex-rows"></div>
</div>
`

export default class LevelupPage extends Page{

  _adventurer
  _titleText = ''

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this._options = this.querySelector('.options')
    this.querySelector('.reroll').addEventListener('click', () => {
      this._reroll()
    })
  }

  static get pathDef(){
    return ['adventurer', 0, 'levelup']
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  get titleText(){
    return this._titleText
  }

  async load(){
    const { adventurer } = await this.fetchData()
    if(!adventurer.nextLevelUp){
      return this.redirectTo(AdventurerPage.path(this.adventurerID))
    }
    this._adventurer = new AdventurerInstance(adventurer)
    this._setupNext(adventurer.nextLevelUp)
  }

  _setupNext(nextLevelUp){
    this._options.innerHTML = ''
    this._selected = false

    nextLevelUp.options.forEach((bonus, index) => {
      const bonusOption = makeEl({ class: 'bonus-option' })
      if(bonus.level > 1){
        const current = {
          ...bonus,
          level: bonus.level - 1
        }
        bonusOption.appendChild(new BonusDetails(current))
        bonusOption.appendChild(makeEl({
          class: 'bonus-arrow',
          content: '<i class="fa-solid fa-arrow-right"></i>'
        }))
      }
      const details = new BonusDetails(bonus)
      bonusOption.addEventListener('click', () => {
        if(!this._selected){
          this._select(index)
        }
      })
      bonusOption.appendChild(details)
      this._options.appendChild(bonusOption)
    })

    this._titleText = `${this._adventurer.displayName} - Level ${nextLevelUp.level}`
    this.app.updateTitle()
  }

  async _select(index){
    this._selected = true
    showLoader()
    const { nextLevelUp } = await fizzetch(`/game/adventurer/${this.adventurerID}/selectbonus/${index}`)
    if(!nextLevelUp){
      return this.redirectTo(AdventurerPage.path(this.adventurerID))
    }
    await fadeOut(this._options)
    this._setupNext(nextLevelUp)
    hideLoader()
    fadeIn(this._options)
  }

  async _reroll(){
    showLoader()
    const { nextLevelUp } = await fizzetch(`/game/adventurer/${this.adventurerID}/rerollbonus`)
    await fadeOut(this._options)
    this._setupNext(nextLevelUp)
    hideLoader()
    fadeIn(this._options)
  }
}

customElements.define('di-levelup-page', LevelupPage)