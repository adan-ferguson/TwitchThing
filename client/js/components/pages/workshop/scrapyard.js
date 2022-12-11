import DIElement from '../../diElement.js'

const HTML = `
<div class="content-columns">
  <div class="content-well fill-contents">
    <di-workshop-inventory></di-workshop-inventory>
  </div>
  <div class="content-rows">
    <div class="content-no-grow right-column">
      <div class="content-well">
        <di-inventory class="to-scrap"></di-inventory>
      </div>
      <div class="symbol">
        <i class="fa-solid fa-arrow-down"></i>
      </div>
      <div class="content-well">
        <di-workshop-component-row class="scrap"></di-workshop-component-row>
      </div>
    </div>
    <button class="upgrade-button" disabled>Scrap</button>
  </div>
</div>
`

export default class Scrapyard extends DIElement{

  get workshopInventoryEl(){
    return this.querySelector('di-workshop-inventory')
  }

  get inventoryToScrap(){
    return this.querySelector('.to-scrap')
  }

  setData(data){
    this.innerHTML = HTML
    this.workshopInventoryEl.setup({
      title: 'Choose items to scrap',
      adventurers: data.adventurers,
      userInventory: data.inventory
    }).inventoryEl.events.on('row_click', row => {
      this._addItemToScrapList(row)
    })
  }

  _addItemToScrapList(row){

  }
}
customElements.define('di-workshop-scrapyard', Scrapyard)