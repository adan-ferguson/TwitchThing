import Page from '../page.js'
import { fadeIn, fadeOut } from '../../../animations/simple.js'
import { hideLoader, showLoader } from '../../../loader.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import Adventurer from '../../../../../game/adventurer.js'
// import LevelupOption from './levelupOption.js'
import { ICON_SVGS } from '../../../assetLoader.js'

const HTML = `
<div class="content-rows">
  <div class="flex-rows flex-no-grow">
    <div class="text">Select a Bonus (UNDER CONSTRUCTION UNTIL NEXT UPDATE)</div>
    <button class="reroll buy-button displaynone">
      <span>Reroll</span>
      <span class="gold-value"></span>
      ${ICON_SVGS.gold}
    </button>
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
    const { adventurer, rerollCost } = await this.fetchData()
    if(!adventurer.nextLevelUp){
      return this.redirectTo(AdventurerPage.path(this.adventurerID))
    }
    this._adventurer = new Adventurer(adventurer)
    this._setupNext(adventurer.nextLevelUp)
    this._updateRerollCost(rerollCost)
  }

  _setupNext(nextLevelUp){
    this._options.innerHTML = ''
    this._selected = false

    nextLevelUp.options.forEach((bonus, index) => {
      const levelupOption = new LevelupOption()
      // if(bonus.level > 1){
      //   const current = {
      //     ...bonus,
      //     level: bonus.level - 1
      //   }
      //   levelupOption.setCurrent(current)
      // }
      levelupOption.setNext(bonus)
      levelupOption.addEventListener('click', () => {
        if(!this._selected){
          this._select(index)
        }
      })
      this._options.appendChild(levelupOption)
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
    const { nextLevelUp, rerollCost } = await fizzetch(`/game/adventurer/${this.adventurerID}/rerollbonus`)
    await fadeOut(this._options)
    this._setupNext(nextLevelUp)
    hideLoader()
    fadeIn(this._options)
    this._updateRerollCost(rerollCost)
  }

  _updateRerollCost(cost){
    this.querySelector('.reroll .gold-value').textContent = cost
    this.querySelector('.reroll').toggleAttribute('disabled', cost > this.user.inventory.gold)
  }
}

customElements.define('di-levelup-page', LevelupPage)