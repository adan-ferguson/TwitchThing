import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from '../../adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import DIForm from '../../form.js'
import FormModal from '../../formModal.js'
import { getSocket } from '../../../socketClient.js'
import '../../list.js'
import { wrap } from '../../../../../game/utilFunctions.js'

const HTML = `
<div class="content-rows">
  <div class="displaynone error-message"></div>
  <div class="content-columns">
    <div class="content-well fill-contents">
      <di-list class="adventurer-list"></di-list>
    </div>
    <div class="content-rows">
      <div class="content-well">
        <di-live-dungeon-map></di-live-dungeon-map>
      </div>
      <button class="flex-no-grow">Discord</button>
    </div>
  </div>
</div>
`

export default class MainPage extends Page{

  _error

  constructor({ error } = {}){
    super()
    this.innerHTML = HTML
    this._error = this.querySelector('.error-message')
    this.querySelector('.adventurer-list')
      .setOptions({
        pageSize: 6
      })
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
    this.querySelector('di-live-dungeon-map').load()
  }

  async unload(){
    getSocket().off('user dungeon run update', this._dungeonRunUpdate)
    this.querySelector('di-live-dungeon-map').unload()
  }

  _populateAdventurers(adventurers, slots){
    const adventurerList = this.querySelector('.adventurer-list')
    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer)
      row.classList.add('clickable')
      row.addEventListener('click', e => {
        this.redirectTo(row.targetPage)
      })
      rows.push(row)
    })

    for(let i = adventurers.length; i < 3; i++){
      if(slots > i){
        const newAdventurerRow = new AdventurerRow()
        rows.push(newAdventurerRow)
        newAdventurerRow.classList.add('clickable')
        newAdventurerRow.addEventListener('click', e => {
          this._showNewAdventurerModal()
        })
      }else{
        rows.push(wrap(`Reach floor ${1 + i * 10} to unlock.`, {
          class: 'blank-row'
        }))
      }
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

    if(this.user.accomplishments.firstRunFinished){
      form.addSelect({
        label: 'Starting Class',
        name: 'class',
        optionsList: [{
          value: 'fighter',
          name: 'Fighter'
        },{
          value: 'tank',
          name: 'Tank'
        },{
          value: 'ranger',
          name: 'Ranger'
        }]
      })
    }

    new FormModal(form).show()
  }

  /**
   * @param error {string|object}
   * @param critical {boolean} If true, then the main page itself failed to load.
   * @private
   */
  _showError(error, critical = false){
    if(!error){
      return
    }
    const message = typeof(error) === 'string' ? error : error.message
    if(message){
      this._error.classList.remove('displaynone')
      this._error.textContent = message || 'An error occurred'
    }
  }

  _dungeonRunUpdate = dungeonRun => {
    const row = this.querySelector(`di-adventurer-row[adventurer-id="${dungeonRun.adventurer._id}"]`)
    if(row){
      row.setDungeonRun(dungeonRun)
    }
  }
}

customElements.define('di-main-page', MainPage)