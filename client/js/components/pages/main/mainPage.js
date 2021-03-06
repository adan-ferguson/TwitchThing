import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from '../../adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import DIForm from '../../form.js'
import FormModal from '../../formModal.js'
import { getSocket } from '../../../socketClient.js'
import '../../list.js'

const HTML = `
<div class="content-rows">
  <div class="displaynone error-message"></div>
  <div class="content-columns">
    <div class="content-well fill-contents">
      <di-list class="adventurer-list"></di-list>
    </div>
    <div class="other-stuff content-well">Other stuff goes over here</div>
  </div>
</div>
`

export default class MainPage extends Page{

  _error

  constructor({ error } = {}){
    super()
    this.innerHTML = HTML
    this._error = this.querySelector('.error-message')
    if(error){
      this._showError(error)
    }
  }

  get titleText(){
    return 'Home Page'
  }

  get backPage(){
    return null
  }

  async load(){
    const { error, adventurers, slots } = await fizzetch('/game/main')
    if(error){
      this._showError(error, true)
    }else{
      this._populateAdventurers(adventurers, slots)
    }
    history.replaceState(null, null, ' ')
    getSocket().on('user dungeon run update', this._dungeonRunUpdate)
  }

  async unload(){
    getSocket().off('user dungeon run update', this._dungeonRunUpdate)
  }

  _populateAdventurers(adventurers, slots){
    const adventurerList = this.querySelector('.adventurer-list')
    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer)
      row.addEventListener('click', e => {
        this.redirectTo(row.targetPage)
      })
      rows.push(row)
    })

    for(let i = adventurers.length; i < slots; i++){
      const newAdventurerRow = new AdventurerRow()
      rows.push(newAdventurerRow)
      newAdventurerRow.addEventListener('click', e => {
        this._showNewAdventurerModal()
      })
    }

    adventurerList.setRows(rows)
  }

  _showNewAdventurerModal(){

    const form = new DIForm({
      async: true,
      action: '/game/newadventurer',
      submitText: 'Create',
      success: result => this.redirectTo(new AdventurerPage(result.adventurerID))
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
    if(message){
      this._error.classList.remove('displaynone')
      this._error.textContent = message
    }
  }

  _dungeonRunUpdate = dungeonRun => {
    const row = this.querySelector(`di-adventurer-row[adventurer-id="${dungeonRun.adventurerID}"]`)
    if(row){
      row.setDungeonRun(dungeonRun)
    }
  }
}

customElements.define('di-main-page', MainPage)