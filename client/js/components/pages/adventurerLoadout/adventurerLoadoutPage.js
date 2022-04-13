import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import { OrbsDisplayStyles } from '../../loadout/loadout.js'
import setupEditable from '../../loadout/setupEditable.js'
import { getStats } from '../../../../../game/adventurer.js'

const HTML = `
<div class="content-columns">
    <div class="content-well user-inventory fill-contents">
        <di-inventory class="fill-contents"></di-inventory>
    </div>
    <div class="content-rows">
        <div class="content-well adventurer-info">
            <div class="flex-rows">
                <div class="adventurer-name"></div>
                <di-stats-list></di-stats-list>
            </div>
        </div>
        <div class="content-well content-no-grow">
            <di-loadout></di-loadout>
        </div>
        <button class="save content-no-grow" disabled="disabled">Save</button>
    </div>
</div>
`

export default class AdventurerLoadoutPage extends Page{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.inventory = this.querySelector('di-inventory')
    this.loadout = this.querySelector('di-loadout')
    this.loadout.setOptions({
      orbsDisplayStyle: OrbsDisplayStyles.SHOW_MAXIMUM,
      editable: true
    })
    this.statsList = this.querySelector('di-stats-list')
    this.saveButton = this.querySelector('button.save')
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  get confirmLeavePageMessage(){
    if(this.loadout.hasChanges){
      return 'Your adventurer has unsaved changes.'
    }
    return null
  }

  async load(){
    const { adventurer, items } = await fizzetch(`/game/adventurer/${this.adventurerID}/editloadout`)
    this.inventory.setItems(items)
    this.loadout.setAdventurer(adventurer)

    this.querySelector('.adventurer-name').textContent = adventurer.name
    this.statsList.setStats(getStats(adventurer))

    setupEditable(this.inventory, this.loadout, {
      onChange: () => {
        this.statsList.setStats(getStats(adventurer, this.loadout.items))
        this._updateSaveButton()
      }
    })

    this.saveButton.addEventListener('click', async (e) => {
      this._saving = true
      this._updateSaveButton()
      const items = this.loadout.items.map(item => item?.id)
      const { error } = await fizzetch(`/game/adventurer/${this.adventurerID}/editloadout/save`, {
        items
      })
      if(error){
        this._showError(error)
        this._saving = false
        this._updateSaveButton()
      }else{
        this.app.setPage(new AdventurerPage(this.adventurerID))
      }
    })
  }

  _updateSaveButton(){
    if(this.loadout.isValid && this.loadout.hasChanges || this._saving){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
    }
  }
}

customElements.define('di-adventurer-loadout-page', AdventurerLoadoutPage)