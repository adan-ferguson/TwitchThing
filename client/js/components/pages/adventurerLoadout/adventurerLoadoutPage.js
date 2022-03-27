import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import { OrbsDisplayStyles } from '../../loadout/loadout.js'
import setupEditable from '../../loadout/setupEditable.js'

const HTML = `
<div class="content-columns">
    <div class="content-well user-inventory">
        <di-inventory></di-inventory>
    </div>
    <div class="flex-rows">
        <div class="content-well adventurer-info">
            <div class="flex-rows">
                <div class="adventurer-name"></div>
                <di-stats-list></di-stats-list>
            </div>
        </div>
        <div class="content-well content-no-grow">
            <di-loadout></di-loadout>
        </div>
        <button class="save" disabled="disabled">Save</button>
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

  async load(){
    debugger
    const { adventurer, items } = await fizzetch(`/game/adventurer/${this.adventurerID}/editloadout`)
    this.inventory.setItems(items)
    this.loadout.setAdventurer(adventurer)
    // this.statsList.setAdventurer(adventurer)

    // TODO: make editable & draggable in such a way that this can be reused for other things
    setupEditable(this.inventory, this.loadout, {
      onChange: () => {
        this._updateSaveButton()
      }
    })
  }

  _updateSaveButton(){
    if(this.loadout.isValid && this.loadout.hasChanges){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
    }
  }
}

customElements.define('di-adventurer-loadout-page', AdventurerLoadoutPage)