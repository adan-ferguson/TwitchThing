import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from './adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import DIForm from '../../form.js'
import DungeonPage from '../dungeon/dungeonPage.js'
import FormModal from '../../formModal.js'
import ResultsPage from '../results/resultsPage.js'
import { getSocket } from '../../../socketClient.js'
import '../../list.js'

const HTML = `
<div class="flex-columns">
  <div class="content-well">
    <di-list class="adventurer-list"></di-list>
  </div>
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
    const myContent = await fizzetch('/game/main')
    if(myContent.error){
      this._showError(myContent.error, true)
    }else{
      await this._populateAdventurers(myContent.adventurers)
    }
    getSocket().on('venture update', this._ventureUpdate)
  }

  async unload(){
    getSocket().off('venture update', this._ventureUpdate)
  }

  async _populateAdventurers(adventurers = []){
    const adventurerList = this.querySelector('.adventurer-list')
    const rows = []
    adventurers.forEach(adventurer => {
      rows.push(new AdventurerRow(adventurer, page => {
        this.app.setPage(page)
      }))
    })

    // TODO: show each available slot
    if(!adventurers.length){
      const newAdventurerRow = new AdventurerRow()
      rows.push(newAdventurerRow)
      newAdventurerRow.addEventListener('click', () => {
        this._showNewAdventurerModal()
      })
    }
    adventurerList.setItems(rows)
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

    new FormModal(form).show()
  }

  /**
   * @param message {string}
   * @param critical {boolean} If true, then the main page itself failed to load.
   * @private
   */
  _showError(message, critical = false){

  }

  _ventureUpdate = venture => {
    const row = this.querySelector(`di-adventurer-row[adventurerID="${venture.adventurerID}"]`)
    if(row){
      row.adventurer.venture = venture
      row.update()
    }
  }
}

customElements.define('di-main-page', MainPage)