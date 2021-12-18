import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from './adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import Modal from '../../modal.js'
import DIForm from '../../form.js'
import DungeonPage from '../dungeon/dungeonPage.js'

const HTML = `
<div class="flex-columns">
  <div class="adventurer-list content-well"></div>
  <div class="other-stuff content-well">Other stuff goes over here</div>
</div>
`

export default class MainPage extends Page {

  constructor({ error } = {}){
    super()
    this.innerHTML = HTML
    if(error){
      this._showError(error)
    }
    // TODO: handle error
  }

  async load(){
    const myContent = await fizzetch('/game/pagedata/main')
    if(myContent.error){
      this._showError(myContent.error, true)
    }else{
      await this._populateAdventurers(myContent.adventurers)
    }
  }

  async _populateAdventurers(adventurers = []){
    const adventurerList = this.querySelector('.adventurer-list')
    adventurers.forEach(adventurer => {
      const adventurerRow = new AdventurerRow(adventurer)
      adventurerList.appendChild(adventurerRow)
      adventurerRow.addEventListener('click', () => {
        this.app.setPage(adventurer.currentVenture ? new DungeonPage(adventurer._id) : new AdventurerPage(adventurer._id))
      })
    })

    // TODO: show each available slot
    if(!adventurers.length){
      const newAdventurerRow = new AdventurerRow()
      adventurerList.appendChild(newAdventurerRow)
      adventurerList.addEventListener('click', () => {
        this._showNewAdventurerModal()
      })
    }
  }

  _showNewAdventurerModal(){

    const form = new DIForm({
      async: true,
      action: '/game/newadventurer',
      submitText: 'Create',
      success: result => this.app.setPage(new AdventurerPage(result.adventurer))
    })

    form.addInput({
      label: 'Name',
      type: 'text',
      name: 'name',
      required: 'required',
      maxLength: 15,
      placeholder: 'Choose a name'
    })
    // TODO: choose adventurer card

    new Modal(form).show()
  }

  /**
   * @param message {string}
   * @param critical {boolean} If true, then the main page itself failed to load.
   * @private
   */
  _showError(message, critical = false){

  }
}

customElements.define('di-main-page', MainPage)