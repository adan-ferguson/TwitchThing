import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from './adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import Modal from '../../modal.js'
import DIForm from '../../form.js'

const HTML = `
<div class="adventurer-list content-well"></div>
<div class="other-stuff content-well">Other stuff goes over here</div>
`

export default class MainPage extends Page {

  constructor(){
    super()
    this.innerHTML = HTML
  }

  async load(){
    const myContent = await fizzetch('/game/pagedata/main')
    await this._populateAdventurers(myContent.adventurers)
  }

  async _populateAdventurers(adventurers = []){
    const adventurerList = this.querySelector('.adventurer-list')
    adventurers.forEach(adventurer => {
      const adventurerRow = new AdventurerRow(adventurer)
      adventurerList.appendChild(adventurerRow)
      adventurerRow.addEventListener('click', () => {
        this.app.setPage(new AdventurerPage(adventurer))
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
}

customElements.define('di-page-main', MainPage)