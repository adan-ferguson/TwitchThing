import DIElement from '../../diElement.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from './setupEditable.js'

const HTML = `
<div class="content-columns fill-contents">
    <div class="content-well user-inventory fill-contents">
        <di-inventory class="fill-contents"></di-inventory>
    </div>
    <div class="hinter edit-hinter">
      <i class="fa-solid fa-arrows-left-right"></i>
    </div>
    <div class="content-rows" style="flex-grow:1.9">
      <div class="content-well">
        <di-adventurer-edit-adventurer-pane></di-adventurer-edit-adventurer-pane>
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

  constructor(){
    super()
    this.innerHTML = HTML
  }

  get adventurerPaneEl(){
    return this.querySelector('di-adventurer-edit-adventurer-pane')
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

    this.inventoryEl.setup(items, adventurer)
    this.adventurerPaneEl.setAdventurer(adventurer)
    this.skillsEl.setup(adventurer)
    this._setupSkillEdit(adventurer)

    // setupEditable(this.inventory, this.adventurerPaneEl.loadoutEl, {
    //   onChange: () => {
    //     this.adventurerPaneEl.update(true)
    //     this._updateSaveButton()
    //   }
    // })

    // TODO: skills
    // setupEditable(){
    //
    // }

    this.saveButton.addEventListener('click', async (e) => {
      if(!this.adventurerPaneEl.loadoutEl.hasChanges){
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
    const items = this.adventurerPaneEl.loadoutEl.objs.map(item => item ? item.id ?? item.itemDef : null)
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
    const orbs = this.adventurerPaneEl.adventurerInstance.orbs
    if(orbs.isValid && !this._saving){
      this.saveButton.removeAttribute('disabled')
    }else{
      this.saveButton.setAttribute('disabled', 'disabled')
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
          loadout.setSkill(skill, slot)
        }else if(change.type === 'remove'){
          loadout.setSkill(null, slotIndex(change.row))
        }else if(change.type === 'swap'){
          loadout.setSkill(change.row.skill, slotIndex(change.row2))
          loadout.setSkill(change.row2.skill, slotIndex(change.row))
        }
        this.adventurerPaneEl.updateAll(true)
        this.skillsEl.listEl.fullUpdate()
      }
    })

    function getNextSlotIndex(loadout, skill){
      for(let i = 0; i < 8; i++){
        if(loadout.canSkillFillSlot(i, skill)){
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

customElements.define('di-adventurer-edit-loadout-tab', LoadoutTab)