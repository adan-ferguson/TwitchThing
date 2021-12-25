import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import MainPage from '../main/mainPage.js'

const HTML = `
<div class='content-well'>
  Here's the results + loot found + xp gained + level up process.
  <button class="done">Okay</button>
</div>
`

export default class ResultsPage extends Page {

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.querySelector('.done').addEventListener('click', async () => {
      const results = await fizzetch(`/game/adventurer/${this.adventurerID}/confirmresults`, {

      })
      if(!results.error){
        this.app.setPage(new AdventurerPage(this.adventurerID))
      }
    })
  }

  async load(){
    const results = await fizzetch(`/game/adventurer/${this.adventurerID}/results`)
    if(results.error){
      if(results.error.targetPage === 'Adventurer'){
        this.app.setPage(new AdventurerPage(this.adventurerID))
      }else if(results.error.targetPage === 'Dungeon'){
        this.app.setPage(new DungeonPage(this.adventurerID))
      }else{
        this.app.setPage(new MainPage(results.error))
      }
    }
  }
}

customElements.define('di-results-page', ResultsPage )