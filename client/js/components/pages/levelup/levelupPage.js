import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="options content-rows"></div>
`

export default class LevelupPage extends Page{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
  }

  get titleText(){
    return this.adventurer.name + ' - Levelup'
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  load(previousPage){
    const { adventurer, ctas, error, targetPage } = await fizzetch(`/game/adventurer/${this.adventurerID}/`)
  }
}

customElements.define('di-levelup-page', LevelupPage)