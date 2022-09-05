import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from '../../loadout/setupEditable.js'
import { adventurerLoadoutItem } from '../../../adventurer.js'
import { OrbsDisplayStyle } from '../../orbRow.js'

const HTML = `
<div class="content-columns">
    <div class="content-well user-inventory fill-contents">
        <di-inventory class="fill-contents"></di-inventory>
    </div>
    <div class="edit-hinter">
        <div><--</div>
        <div>Click or drag items to swap</div>
        <div>--></div>
    </div>
    <div class="content-rows">
        <di-adventurer-pane></di-adventurer-pane>
        <button class="save content-no-grow" disabled="disabled">Save</button>
    </div>
</div>
`

export default class AdventurerLoadoutEditorPage extends Page{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML

    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this.inventory = this.querySelector('di-inventory')
    this.saveButton = this.querySelector('button.save')
  }

  static get pathDef(){
    return ['adventurer', 0, 'editloadout']
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  get titleText(){
    return this.adventurer.name + ' - Edit Equipment'
  }

  get confirmLeavePageMessage(){
    if(this.adventurerPane.loadoutEl.hasChanges){
      return 'Your adventurer has unsaved changes.'
    }
    return null
  }

  async load(){
    const { adventurer, items } = await this.fetchData()
    this.adventurer = adventurer
    this.inventory.setup(
      Object.values(items).map(itemDef => adventurerLoadoutItem(itemDef)),
      adventurer
    )
    this.adventurerPane.setAdventurer(adventurer)

    setupEditable(this.inventory, this.adventurerPane.loadoutEl, {
      onChange: () => {
        this.adventurerPane.updateStats(true)
        this.adventurerPane.updateOrbs()
        this._updateSaveButton()
      }
    })

    this.saveButton.addEventListener('click', async (e) => {
      if(!this.adventurerPane.loadoutEl.hasChanges){
        return this.redirectTo(AdventurerPage.path(this.adventurerID))
      }
      this._saving = true
      this._updateSaveButton()
      const items = this.adventurerPane.loadoutEl.objs.map(item => item?.id)
      const { error, success } = await fizzetch('/game' + this.path + '/save', {
        items
      })
      if(!success){
        console.error(error || 'Saving failed for some reason')
        this._saving = false
        this._updateSaveButton()
      }else{
        this.redirectTo(AdventurerPage.path(this.adventurerID))
      }
    })
  }

  _updateSaveButton(){
    if(this.adventurerPane.loadoutEl.orbsData.isValid || this._saving){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
    }
  }
}

customElements.define('di-adventurer-loadout-editor-page', AdventurerLoadoutEditorPage)