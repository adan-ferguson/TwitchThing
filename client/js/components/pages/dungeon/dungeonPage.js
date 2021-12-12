import Page from '../page.js'

const HTML = 'nothing here LOL'

export default class DungeonPage extends Page {

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
  }

  async load(){
    
  }
}

customElements.define('di-dungeon-page', DungeonPage )