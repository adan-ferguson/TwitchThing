import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from '../../loadout/setupEditable.js'
import SimpleModal from '../../simpleModal.js'

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
      <div class="content-well">
        <di-adventurer-pane></di-adventurer-pane>
      </div>
      <button class="save content-no-grow">Save</button>
    </div>
</div>
`

export default class AdventurerLoadoutEditorPage extends Page{

  _saved = false

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

  async unload(){

    if(!this.adventurerPane.loadoutEl.hasChanges || this._saved){
      return false
    }

    const result = await new SimpleModal('Save changes before leaving page?', [{
      text: 'Leave Without Saving',
      style: 'scary',
      value: 'leave'
    },{
      text: 'Save',
      style: 'good',
      value: 'save'
    }]).show().awaitResult()

    if(result === 'leave'){
      return false
    }else if(result === 'save'){
      if(await this._save()){
        return false
      }
    }

    // Neither button clicked, modal was closed, stay on the page
    return true
  }

  async load(){
    const { adventurer, items } = await this.fetchData()
    this.adventurer = adventurer
    this.inventory.setup(items, adventurer)
    this.adventurerPane.setAdventurer(adventurer)

    setupEditable(this.inventory, this.adventurerPane.loadoutEl, {
      onChange: () => {
        this.adventurerPane.update(true)
        this._updateSaveButton()
      }
    })

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

customElements.define('di-adventurer-loadout-editor-page', AdventurerLoadoutEditorPage)