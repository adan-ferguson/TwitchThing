import LoadoutRow from './loadoutRow.js'

const HTML = `
<div class="content-rows">
    <div class="filtering-options content-no-grow">
        Filtering options here
    </div>
    <di-list></di-list>
</div>
`

export default class Inventory extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML

    this.filteringOptions = this.querySelector('.filteringOptions')
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      pageSize: 15
    })
  }

  setItems(items){
    const loadoutRows = []
    items.forEach(item => {
      if(item){
        const row = new LoadoutRow(item)
        loadoutRows.push(row)
      }
    })
    this.list.setItems(loadoutRows)
  }
}

customElements.define('di-inventory', Inventory)