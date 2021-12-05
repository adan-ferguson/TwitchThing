import Page from '../pages/page.js'
import AdventurerPage from '../pages/adventurer.js'
import AdventurerRow from './adventurerRow.js'
import fizzetch from '../../fizzetch.js'
import Modal from '../modal.js'
import DIForm from '../form.js'

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
    const myContent = await fizzetch('/game/load', { category: 'mainpage' })
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

    // TODO: only add "create new" button if user has an available slot
    if(!adventurers.length){
      const newAdventurerRow = document.createElement('div')
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
      type: 'text',
      name: 'name',
      required: 'required',
      maxLength: 15,
      placeholder: 'Choose a name for your Adventurer'
    })
    // TODO: choose adventurer card

    form.onsubmit = async e => {
      if(!form.async){
        return
      }
      e.preventDefault()
      const name = form.get('name')
      const result = await fizzetch('/game/newadventurer', { name: name })
      if(result.error){
        form.addError(result.error)
      }else{
      }
    }

    Modal.custom(form)
  }
}

customElements.define('di-page-main', MainPage)