import DIElement from '../../diElement.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from './setupEditable.js'
import { OrbsDisplayStyle } from '../../orbRow.js'

const HTML = `
<div class="content-columns fill-contents">
    <div class="content-well user-inventory fill-contents">
        <di-inventory class="fill-contents"></di-inventory>
    </div>
    <div class="hinter edit-hinter">
      <i class="fa-solid fa-arrows-left-right"></i>
    </div>
    <div class="content-rows" style="flex-grow:2">
      <div class="content-well">
        <di-adventurer-pane></di-adventurer-pane>
      </div>
      <button class="save content-no-grow">Save</button>
    </div>
    <div class="hinter edit-hinter">
      <i class="fa-solid fa-arrows-left-right"></i>
    </div>
    <div class="content-well adventurer-skills fill-contents">
        <di-adventurer-edit-skills class="fill-contents"></di-adventurer-edit-skills>
    </div>
</div>
`

export default class LoadoutTab extends DIElement{

  _saving = false

  constructor(){
    super()
    this.innerHTML = HTML
    this.adventurerPaneEl.setOptions({
      orbsStyle: OrbsDisplayStyle.REMAINING,
      hideXpBar: true
    })
  }

  get adventurerPaneEl(){
    return this.querySelector('di-adventurer-pane')
  }

  get inventoryEl(){
    return this.querySelector('di-inventory')
  }

  get skillsEl(){
    return this.querySelector('di-adventurer-edit-skills')
  }

  get saveButton(){
    return this.querySelector('button.save')
  }

  async showData(parentPage){

    const { items, adventurer } = parentPage

    this._adventurer = adventurer

    this.inventoryEl.setup(items, adventurer)
    this.adventurerPaneEl.setAdventurer(adventurer)
    this.skillsEl.setup(adventurer)
    this._setupItemEdit(adventurer)
    this._setupSkillEdit(adventurer)
    this._updateSaveButton()

    this.saveButton.addEventListener('click', async (e) => {
      if(await this._save()){
        this.parentPage.redirectTo(AdventurerPage.path(this._adventurer.id))
      }
    })
  }

  async _save(){
    this._saving = true
    this._updateSaveButton()
    const { error, success } = await fizzetch('/game' + this.parentPage.path + '/save', {
      items: this._adventurer.loadout.items.map(i => i?.def),
      skills: this._adventurer.loadout.skills.map(s => s?.id)
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
    const orbsValid = this._adventurer.orbsData.isValid
    const loadoutValid = this._adventurer.loadout.isValid
    this.saveButton.toggleAttribute('disabled', !orbsValid || !loadoutValid || this._saving)
  }

  _setupItemEdit(adventurer){

    setupEditable(this.inventoryEl.listEl, this.adventurerPaneEl.querySelector('.adv-items'), {
      rowSelector: 'di-adventurer-item-row',
      suggestChange: change => {
        const loadout = adventurer.loadout
        if(change.type === 'add'){
          const item = change.row.item
          const slot = change.row2 ?
            slotIndex(change.row2) :
            getNextSlotIndex(loadout, item)
          if(slot === -1){
            return
          }
          this.inventoryEl.removeItem(item)
          loadout.setSlot(0,  slot, item)
        }else if(change.type === 'remove'){
          this.inventoryEl.addItem(change.row.item)
          loadout.setSlot(0,  slotIndex(change.row), null, )
        }else if(change.type === 'swap'){
          loadout.setSlot(0, slotIndex(change.row2), change.row.item, )
          loadout.setSlot(0, slotIndex(change.row), change.row2.item, )
        }
        this.adventurerPaneEl.update(true)
        this._updateSaveButton()
      }
    })

    function getNextSlotIndex(loadout, item){
      for(let i = 0; i < 8; i++){
        if(!loadout.items[i] && loadout.canFillSlot(0, i, item)){
          return i
        }
      }
      return -1
    }

    function slotIndex(row){
      return parseInt(row.getAttribute('slot-index'))
    }
  }

  _setupSkillEdit(adventurer){

    setupEditable(this.skillsEl.listEl, this.adventurerPaneEl.querySelector('.adv-skills'), {
      rowSelector: 'di-adventurer-skill-row',
      suggestChange: change => {
        const loadout = adventurer.loadout
        if(change.type === 'add'){
          const skill = change.row.skill
          const slot = change.row2 ?
            slotIndex(change.row2) :
            getNextSlotIndex(loadout, skill)
          if(slot === -1){
            return
          }
          loadout.setSlot(1, slot, skill)
        }else if(change.type === 'remove'){
          loadout.setSlot(1, slotIndex(change.row), null)
        }else if(change.type === 'swap'){
          loadout.setSlot(1, slotIndex(change.row2), change.row.skill)
          loadout.setSlot(1, slotIndex(change.row), change.row2.skill)
        }
        this.adventurerPaneEl.update(true)
        this.skillsEl.listEl.fullUpdate()
        this._updateSaveButton()
      }
    })

    function getNextSlotIndex(loadout, skill){
      for(let i = 0; i < 8; i++){
        if(!loadout.skills[i] && loadout.canFillSlot(1, i, skill)){
          return i
        }
      }
      return -1
    }

    function slotIndex(row){
      return parseInt(row.getAttribute('slot-index'))
    }
  }
}

customElements.define('di-adventurer-loadout-tab', LoadoutTab)