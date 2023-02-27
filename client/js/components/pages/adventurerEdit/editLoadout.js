import DIElement from '../../diElement.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from '../../loadout/setupEditable.js'

const HTML = `
<div class="content-columns">
    <div class="content-well user-inventory fill-contents">
        <di-inventory class="fill-contents"></di-inventory>
    </div>
    <div class="hinter edit-hinter">
        <div><--</div>
        <div>Click or drag items to swap</div>
        <div>--></div>
    </div>
    <div class="content-rows">
      <div class="content-well">
        <di-adventurer-pane></di-adventurer-pane>
      </div>
      <button class="save content-no-grow">Save</button>
    </div>
</div>
`

export default class EditLoadout extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.adventurerPane = this.querySelector('di-adventurer-pane')
    this.inventory = this.querySelector('di-inventory')
    this.saveButton = this.querySelector('button.save')
  }

  get adventurerPaneEl(){
    return this.querySelector('di-adventurer-edit-pane')
  }

  get inventoryEl(){
    return this.querySelector('di-user-inventory')
  }

  get saveButton(){
    return this.querySelector('button.save')
  }

  async show(parentPage){

    const { items, adventurer } = parentPage

    this.inventory.setup(items, adventurer)
    this.adventurerPane.setAdventurer(adventurer)

    setupEditable(this.inventory, this.adventurerPane.loadoutEl, {
      onChange: () => {
        this.adventurerPane.update(true)
        this._updateSaveButton()
      }
    })

    // TODO: skills
    // setupEditable(){
    //
    // }

    this.saveButton.addEventListener('click', async (e) => {
      if(!this.adventurerPane.loadoutEl.hasChanges){
        return this.redirectTo(AdventurerPage.path(this.adventurerID))
      }
      if(await this._save()){
        this.redirectTo(AdventurerPage.path(this.adventurerID))
      }
    })
  }

  async _save(){
    this._saving = true
    this._updateSaveButton()
    const items = this.adventurerPane.loadoutEl.objs.map(item => item ? item.id ?? item.itemDef : null)
    const { error, success } = await fizzetch('/game' + this.path + '/save', {
      items
    })
    if(!success){
      console.error(error || 'Saving failed for some reason')
      this._saving = false
      this._updateSaveButton()
      return false
    }
    this._saved = true
    return true
  }

  _updateSaveButton(){
    const orbs = this.adventurerPane.adventurerInstance.orbs
    if(orbs.isValid && !this._saving){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
    }
  }
}

customElements.define('di-edit-loadout', EditLoadout)