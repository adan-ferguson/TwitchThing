import DIElement from '../../diElement.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
import fizzetch from '../../../fizzetch.js'
import setupEditable from './setupEditable.js'
import { OrbsDisplayStyle } from '../../orbRow.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'
import ItemQuickUpgrade from '../../itemQuickUpgrade.js'
import SimpleModal from '../../simpleModal.js'
import AdventurerItem from '../../../../../game/items/adventurerItem.js'
import Modal from '../../modal.js'
import AddXpModalContent from '../adventurer/addXpModalContent.js'
import { hideLoader, showLoader } from '../../../loader.js'

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
      <button class="save content-no-grow">Okay</button>
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
      orbsStyle: OrbsDisplayStyle.REMAINING
    })
    this._setupItemEdit()
    this._setupSkillEdit()
    this.saveButton.addEventListener('click', async (e) => {
      this.parentPage.redirectTo(AdventurerPage.path(this._adventurer.id))
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

  async unload(){
    if(!this._adventurer){
      return
    }
    if(!this._adventurer.isValid){
      return await new SimpleModal('Your loadout is invalid and you will not be able to do anything, exit anyway?', [{
        text: 'Yes',
        value: false
      },{
        text: 'No',
        value: true
      }]).show().awaitResult()
    }
  }

  async showData(parentPage){

    const { items, adventurer, user } = parentPage

    this._adventurer = adventurer

    this.inventoryEl.setup(items, adventurer)
    this.adventurerPaneEl.setAdventurer(adventurer)
    this.skillsEl.setup(adventurer, user.features.skills)
    this._setupQuickUpgrades(user)

    if(user.features.shop || user.inventory.stashedXp){
      this._setupAdder(user, adventurer)
    }
  }
  //
  // adventurerSkillRightClickOverride(adventurerSkillRow){
  //   showUnlockModal(adventurerSkillRow.adventurerSkill, this._adventurer, async s => {
  //     const adv = this.parentPage?.adventurer
  //     if(!adv || !s){
  //       return
  //     }
  //     adv.upgradeSkill(s)
  //     await fizzetch('/game' + this.parentPage.path + '/spendskillpoint', { skillId: s.id })
  //     this.parentPage.reload()
  //   })
  // }

  adventurerItemRightClickOverride(adventurerItemRow){
    // TODO: this is pretty hacky...
    const itemSlot = parseInt(adventurerItemRow.getAttribute('slot-index') ?? -1)
    const isEquipped = itemSlot > -1
    const item = adventurerItemRow.adventurerItem
    const iqu = new ItemQuickUpgrade(item, this.parentPage.user.inventory, isEquipped)
    const modal = new Modal(iqu).show()

    iqu.querySelector('.upgrade-button').addEventListener('click', () => {
      modal.hide()
      const data = {}
      if(isEquipped){
        data.itemSlot = itemSlot
        data.adventurerID = this._adventurer.id
      }else{
        data.itemDef = item.def
      }
      fizzetch('/game/workshop/forge/upgrade', data)
        .then(({ upgradedItemDef }) => {
          this.inventoryEl.setup(this.parentPage.user.inventory.items, this._adventurer)
          if(isEquipped){
            const item = new AdventurerItem(upgradedItemDef)
            this._adventurer.loadout.setSlot(0, itemSlot, item)
            this.adventurerPaneEl.update(true)
          }else{
            this.inventoryEl.scrollToAndFlash(upgradedItemDef.id)
          }
        })
    })
  }

  async _save(){
    this._saving = true
    const { error, success } = await fizzetch('/game' + this.parentPage.path + '/save', {
      items: this._adventurer.loadout.items.map(i => i?.def),
      skills: this._adventurer.loadout.skills.map(s => s?.id)
    })
    if(!success){
      console.error(error || 'Saving failed for some reason')
      this._saving = false
      return false
    }
    this._saved = true
    return true
  }

  _setupItemEdit(){

    setupEditable(this.inventoryEl.listEl, this.adventurerPaneEl.querySelector('.adv-items'), {
      rowSelector: 'di-adventurer-item-row',
      suggestChange: change => {
        const loadout = this._adventurer.loadout
        if(change.type === 'add'){
          const item = change.row.item
          const slot = change.row2 ?
            slotIndex(change.row2) :
            getNextSlotIndex(loadout, item)
          if(slot === -1){
            return
          }
          this.inventoryEl.removeItem(item)
          this.inventoryEl.addItem(loadout.items[slot])
          loadout.setSlot(0, slot, item)
        }else if(change.type === 'remove'){
          this.inventoryEl.addItem(change.row.item)
          loadout.setSlot(0, slotIndex(change.row), null)
        }else if(change.type === 'swap'){
          loadout.setSlot(0, slotIndex(change.row2), change.row.item)
          loadout.setSlot(0, slotIndex(change.row), change.row2.item)
        }
        this.adventurerPaneEl.update(true)
        this._save()
      }
    })

    function getNextSlotIndex(loadout, item){
      let lastValid
      for(let i = 0; i < 8; i++){
        const empty = !loadout.items[i]
        const valid = loadout.canFillSlot(0, i, item)
        if(empty && valid){
          return i
        }
        if(valid){
          lastValid = i
        }
      }
      return lastValid ?? -1
    }

    function slotIndex(row){
      return parseInt(row.getAttribute('slot-index'))
    }
  }

  _setupSkillEdit(){

    setupEditable(this.skillsEl.listEl, this.adventurerPaneEl.querySelector('.adv-skills'), {
      rowSelector: 'di-adventurer-skill-row',
      suggestChange: change => {
        const loadout = this._adventurer.loadout
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
        this._save()
      }
    })

    function getNextSlotIndex(loadout, skill){
      let lastValid
      for(let i = 0; i < 8; i++){
        const empty = !loadout.skills[i]
        const valid = loadout.canFillSlot(1, i, skill)
        if(empty && valid){
          return i
        }
        if(valid){
          lastValid = i
        }
      }
      return lastValid ?? -1
    }

    function slotIndex(row){
      return parseInt(row.getAttribute('slot-index'))
    }
  }

  _setupQuickUpgrades(user){
    const quickUpgrades = user.features.workshop ? true : false
    this.classList.toggle('adventurer-item-right-click-override', quickUpgrades)
    this.classList.toggle('adventurer-skill-right-click-override', true)

    const calloutName = 'quick-upgrade-callout'
    if(quickUpgrades && !localStorage.getItem(calloutName)){
      tippyCallout(this.inventoryEl, 'You can also upgrade items in the right-click "more info" pane.')
      localStorage.setItem(calloutName, true)
    }
  }

  _setupAdder(user, adventurer){
    const adder = this.adventurerPaneEl.showAdder()
    adder.addEventListener('click', () => {
      const content = new AddXpModalContent(user, adventurer)
      new SimpleModal(content, {
        text: 'Confirm',
        style: 'good',
        fn: () => {
          if(content.val){
            showLoader()
            fizzetch(`/game/adventurer/${adventurer.id}/addxp`, {
              xp: content.val
            }).then(() => {
              hideLoader()
              this.parentPage.reload()
            })
          }
        }
      }, 'Stashed XP').show()
    })
  }
}

customElements.define('di-adventurer-loadout-tab', LoadoutTab)