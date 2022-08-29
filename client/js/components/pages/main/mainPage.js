import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import AdventurerRow from '../../adventurerRow.js'
import fizzetch from '../../../fizzetch.js'
import DIForm from '../../form.js'
import FormModal from '../../formModal.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import '../../list.js'
import { wrap } from '../../../../../game/utilFunctions.js'
import LiveDungeonMapPage from '../liveDungeonMap/liveDungeonMapPage.js'

const HTML = `
<div class="content-rows">
  <div class="displaynone error-message"></div>
  <div class="content-columns">
    <div class="content-well fill-contents">
      <di-list class="adventurer-list"></di-list>
    </div>
    <div class="content-rows">
      <div class="content-well live-dungeon-map clickable">
        View Live Dungeon Map
      </div>
      <a href="https://discord.gg/Y3UDA9SX" target="_blank" class="flex-no-grow discord buttonish">
        <i class="fab fa-discord"></i> Join the Discord server for updates and news
      </a>
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
    this.querySelector('.live-dungeon-map').addEventListener('click', () => {
      this.redirectTo(new LiveDungeonMapPage())
    })
    this.querySelector('.adventurer-list')
      .setOptions({
        pageSize: 6
      })
    if(error){
      this._showError(error)
    }
  }

  static get pathDef(){
    return []
  }

  get path(){
    return ''
  }

  get backPage(){
    return null
  }

  async load(_){
    const { error, adventurers } = await this.fetchData()
    if(error){
      this._showError(error, true)
    }else{
      this._populateAdventurers(adventurers, this.user.inventory.adventurerSlots)
    }
    history.replaceState(null, null, ' ')
    joinSocketRoom('user all adventurers ' + this.app.user._id)
    getSocket().on('user dungeon run update', this._dungeonRunUpdates)
  }

  async unload(){
    leaveSocketRoom('user all adventurers ' + this.app.user._id)
    getSocket().off('user dungeon run update', this._dungeonRunUpdates)
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

  _dungeonRunUpdates = dungeonRuns => {
    dungeonRuns.forEach(dungeonRun => {
      const row = this.querySelector(`di-adventurer-row[adventurer-id="${dungeonRun.adventurer._id}"]`)
      if(row){
        row.setDungeonRun(dungeonRun)
      }
    })
  }
}

customElements.define('di-main-page', MainPage)