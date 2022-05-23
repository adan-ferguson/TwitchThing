import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import { fadeIn, fadeOut } from '../../../animationHelper.js'
import { showLoader } from '../../../loader.js'
import BonusDetails from './bonusDetails.js'

const HTML = `
<div class="options flex-rows"></div>
`

export default class LevelupPage extends Page{

  _titleText = ''

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
    this._options = this.querySelector('.options')
  }

  get titleText(){
    return this._titleText
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(previousPage){
    const { adventurer } = await this.fetchData(`/game/adventurer/${this.adventurerID}`)
    if(!adventurer.nextLevelUp){
      return this.redirectTo(new AdventurerPage(this.adventurerID))
    }
    this._adventurer = adventurer
    this._setupNext(adventurer.nextLevelUp)
  }

  _setupNext(nextLevelUp){
    this._options.innerHTML = ''
    this._selected = false

    this._adventurer.nextLevelUp.options.forEach((bonus, index) => {
      const details = new BonusDetails(bonus)
      details.addEventListener('click', () => {
        if(!this._selected){
          this._select(index)
        }
      })
      this._options.appendChild(details)
    })

    this._titleText = `${this._adventurer.name} - Level ${nextLevelUp.level}`
    this.app.updateTitle()
  }

  async _select(index){
    this._selected = true
    showLoader()
    const { nextLevelUp } = this.fetchData(`/game/adventurer/${this.adventurerID}/selectbonus/${index}`)
    if(!nextLevelUp){
      return this.redirectTo(new AdventurerPage(this.adventurerID))
    }
    await fadeOut(this._options)
    this._setupNext(nextLevelUp)
    fadeIn(this._options)
  }
}

customElements.define('di-levelup-page', LevelupPage)