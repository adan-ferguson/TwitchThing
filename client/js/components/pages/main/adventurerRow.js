import ResultsPage from '../results/resultsPage.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'

const HTML = `
Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span>
`

export default class AdventurerRow extends HTMLButtonElement {
  constructor(adventurer, setPageFn){
    super()
    this.classList.add('adventurer-row')
    if(!adventurer) {
      this.innerHTML = 'Create a new Loadout'
      return
    }

    this.adventurer = adventurer
    this.innerHTML = HTML
    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = adventurer.level

    if(adventurer.currentVenture){
      // More info
      this.querySelector('.status').textContent = adventurer.currentVenture.finished ? 'Finished' : 'Running'
    }

    this.addEventListener('click', () => {
      let page
      if(adventurer.currentVenture){
        if(adventurer.currentVenture.finished){
          page = new ResultsPage(adventurer._id)
        }else{
          page = new DungeonPage(adventurer._id)
        }
      }else{
        page = new AdventurerPage(adventurer._id)
      }
      setPageFn(page)
    })
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })