import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from '../../loadout/setupEditable.js'

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

  get titleText(){
    return this.adventurer.name + ' - Edit Equipment'
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  get confirmLeavePageMessage(){
    if(this.adventurerPane.loadoutEl.hasChanges){
      return 'Your adventurer has unsaved changes.'
    }
    return null
  }

  async load(){
    const { adventurer, items } = await fizzetch(`/game/adventurer/${this.adventurerID}/editloadout`)
    this.adventurer = adventurer
    this.inventory.setItems(items)
    this.adventurerPane.setAdventurer(adventurer)

    setupEditable(this.inventory, this.adventurerPane.loadoutEl, {
      onChange: () => {
        this.adventurerPane.updateStats()
        this._updateSaveButton()
      }
    })

    this.saveButton.addEventListener('click', async (e) => {
      this._saving = true
      this._updateSaveButton()
      const items = this.adventurerPane.loadoutEl.items.map(item => item?.id)
      const { error } = await fizzetch(`/game/adventurer/${this.adventurerID}/editloadout/save`, {
        items
      })
      if(error){
        this._showError(error)
        this._saving = false
        this._updateSaveButton()
      }else{
        this.redirectTo(new AdventurerPage(this.adventurerID))
      }
    })
  }

  _updateSaveButton(){
    if(this.adventurerPane.loadoutEl.isValid && this.adventurerPane.loadoutEl.hasChanges || this._saving){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
    }
  }
}

customElements.define('di-adventurer-loadout-editor-page', AdventurerLoadoutEditorPage)