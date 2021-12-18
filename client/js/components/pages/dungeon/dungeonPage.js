import Page from '../page.js'
import MainPage from '../main/mainPage.js'

const HTML = 'nothing here LOL'

export default class DungeonPage extends Page {

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
  }

  async load(){
    
  }

  get backPage(){
    return () => new MainPage()
  }
}

customElements.define('di-dungeon-page', DungeonPage )