import Page from '../pages/page.js'
import AdventurerRow from './adventurerRow.js'
import fizzetch from '../../fizzetch.js'

const HTML = `
<div class="adventurer-list content-well"></div>
<div class="other-stuff content-well">Other stuff goes over here</div>
`

const CONTENT_QUERY = {
  adventurers: {
    name: 1,
    level: 1,
  }
}

export default class MainPage extends Page {

  constructor(){
    super()
    this.innerHTML = HTML
  }

  async load(){
    const myContent = await fizzetch('/game/userdata', CONTENT_QUERY)
    await this._populateAdventurers(myContent.adventurers)
  }

  async _populateAdventurers(adventurers = []){
    const adventurerList = this.querySelector('.adventurer-list')
    adventurers.forEach(adventurer => {
      const adventurerRow = new AdventurerRow(adventurer)
      adventurerList.appendChild(adventurerRow)
      adventurerRow.addEventListener('click', () => {
        // TODO: go to adventurer page
      })
    })

    // TODO: add a "create new" button
    // TODO: only add "create new" button if user has a character card
  }
}

customElements.define('di-page-main', MainPage)