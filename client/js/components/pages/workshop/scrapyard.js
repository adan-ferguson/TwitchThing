import DIElement from '../../diElement.js'
import { addInventoryItem, removeInventoryItem, rowsToInventoryItems } from '../../listHelpers.js'
import fizzetch from '../../../fizzetch.js'
import { hideLoader, showLoader } from '../../../loader.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-workshop-inventory></di-workshop-inventory>
  </div>
  <div class="hinter">
      <div><--</div>
      <div>Click items to swap (shift for all)</div>
      <div>--></div>
  </div>
  <div class="content-rows">
    <div class="content-no-grow right-column">
      <div class="content-well">
        <div class="supertitle">Scrapped</div>
        <di-list class="to-scrap"></di-list>
      </div>
    </div>
    <button class="scrap-button" disabled>
      <span>+<span class="scrap-count">0</span></span>
      <i class="fa-solid fa-recycle"></i>
    </button>
  </div>
</div>
`

export default class Scrapyard extends DIElement{

  get workshopInventoryEl(){
    return this.querySelector('di-workshop-inventory')
  }

  /**
   * @returns {List}
   */
  get toScrapEl(){
    return this.querySelector('.to-scrap')
  }

  get scrapEl(){
    return this.querySelector('.scrap-count')
  }

  get scrapButton(){
    return this.querySelector('.scrap-button')
  }

  async load(){
    const { data } = await fizzetch('/game/workshop/scrapyard')
    this._inventory = data.inventory
    this.innerHTML = HTML

    this.workshopInventoryEl.setup({
      title: 'Choose items to scrap',
      userInventory: this._inventory
    }).listEl.events.on('clickrow', ({ e, row }) => {
      this._addItemToScrapList(row.loadoutItem, e.shiftKey)
    })

    this.toScrapEl.setOptions({
      pageSize: 12,
      clickableRows: true
    }).events.on('clickrow', ({ e, row }) => {
      this._removeItemFromScrapList(row.loadoutItem, e.shiftKey)
    })

    this.scrapButton.addEventListener('click', async () => {
      showLoader()
      await fizzetch('/game/workshop/scrapyard/scrap', {
        scrappedItems: rowsToInventoryItems(this.toScrapEl.allRows)
      })
      this.toScrapEl.clear()
      this._updateScrapCount()
      hideLoader()
    })
  }

  _addItemToScrapList(loadoutItem, all = false){
    const count = removeInventoryItem(this.workshopInventoryEl.listEl, loadoutItem, all)
    addInventoryItem(this.toScrapEl, loadoutItem, count)
    this._updateScrapCount()
  }

  _removeItemFromScrapList(loadoutItem, all = false){
    const count = removeInventoryItem(this.toScrapEl, loadoutItem, all)
    addInventoryItem(this.workshopInventoryEl.listEl, loadoutItem, count)
    this._updateScrapCount()
  }

  _updateScrapCount(){
    let scrap = 0
    this.toScrapEl.allRows.forEach(row => {
      scrap += row.loadoutItem.scrapValue * (row.count ?? 1)
    })
    this.scrapEl.textContent = scrap
    this.scrapButton.toggleAttribute('disabled', !scrap)
  }

}
customElements.define('di-workshop-scrapyard', Scrapyard)