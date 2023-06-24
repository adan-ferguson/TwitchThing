import Page from '../page.js'
import AdventurerRow from '../../adventurer/adventurerRow.js'
import DIForm from '../../form.js'
import FormModal from '../../formModal.js'
import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import '../../list.js'
import LiveDungeonMapPage from '../liveDungeonMap/liveDungeonMapPage.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import ShopPage from '../shop/shopPage.js'
import WorkshopPage from '../workshop/workshopPage.js'

const HTML = `
<div class="content-rows">
  <div class="content-columns">
    <div class="content-well fill-contents">
      <di-list class="adventurer-list"></di-list>
    </div>
    <div class="content-rows">
      <div class="content-well shop clickable">
        Market
      </div>
      <div class="content-well workshop clickable">
        Workshop
      </div>
      <div class="content-well live-dungeon-map clickable">
        View Live Dungeon Map
      </div>
      <a href="https://discord.gg/CNe7EMmzam" target="_blank" class="flex-no-grow discord buttonish">
        <i class="fab fa-discord"></i> Join the Discord server for updates and news
      </a>
    </div>
  </div>
</div>
`

export default class MainPage extends Page{

  constructor(){
    super()
    this.innerHTML = HTML
    this.querySelector('.live-dungeon-map').addEventListener('click', () => {
      this.redirectTo(LiveDungeonMapPage.path())
    })

    this._shopEl = this.querySelector('.shop')
    this._shopEl.addEventListener('click', () => {
      this.redirectTo(ShopPage.path())
    })

    this._workshopEl = this.querySelector('.workshop')
    this._workshopEl.addEventListener('click', () => {
      this.redirectTo(WorkshopPage.path())
    })

    this.querySelector('.adventurer-list')
      .setOptions({
        pageSize: 5
      })
  }

  async load(){
    const { adventurers } = await this.fetchData()
    this._populateAdventurers(adventurers, this.user.inventory.adventurerSlots)
    history.replaceState(null, null, '')
    joinSocketRoom('user all adventurers ' + this.app.user._id)
    getSocket().on('user dungeon run update', this._dungeonRunUpdates)

    if(this.user.features.shop === 1){
      this._shopEl.classList.add('glow')
    }else if(!this.user.features.shop){
      this._shopEl.classList.add('displaynone')
    }

    if(this.user.features.workshop === 1){
      this._workshopEl.classList.add('glow')
    }else if(!this.user.features.workshop){
      this._workshopEl.classList.add('displaynone')
    }
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

    for(let i = adventurers.length; i < slots; i++){
      const newAdventurerRow = new AdventurerRow()
      rows.push(newAdventurerRow)
      newAdventurerRow.classList.add('clickable')
      newAdventurerRow.addEventListener('click', e => {
        this._showNewAdventurerModal()
      })
    }

    adventurerList.setRows(rows)
  }

  _showNewAdventurerModal(){

    const form = new DIForm({
      async: true,
      action: '/game/adventurer/new',
      submitText: 'Create',
      success: result => this.redirectTo(AdventurerPage.path(result.adventurerID))
    })

    form.addInput({
      label: 'Name',
      type: 'text',
      name: 'name',
      required: 'required',
      maxLength: 15,
      placeholder: 'Choose a name'
    })

    new FormModal(form).show()
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