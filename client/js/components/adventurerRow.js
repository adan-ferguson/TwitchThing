import './timer.js'
import AdventurerPage from './pages/adventurer/adventurerPage.js'
import DungeonPage from './pages/dungeon/dungeonPage.js'

const HTML = `
<di-adventurer-status></di-adventurer-status>
`

export default class AdventurerRow extends HTMLElement{

  _depth
  _adventurerStatusEl

  adventurer

  constructor(adventurer){
    super()

    if(!adventurer){
      this.innerHTML = '<span class="center-contents">Create a new Adventurer</span>'
      return
    }

    this.innerHTML = HTML
    this.adventurer = adventurer
    this._adventurerStatusEl = this.querySelector('di-adventurer-status')
      .setAdventurer(adventurer)
    this.setAttribute('adventurer-id', adventurer._id)
  }

  get targetPage(){
    if(!this.dungeonRun){
      return AdventurerPage.path(this.adventurer._id)
    }else{
      return DungeonPage.path(this.dungeonRun._id)
    }
  }

  setDungeonRun(dungeonRun){
    this._adventurerStatusEl.setDungeonRun(dungeonRun)
  }
}

customElements.define('di-adventurer-row', AdventurerRow)