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
    Object.values(items).forEach(item => {
      if(item){
        const row = new LoadoutRow()
        row.setItem(item)
        row.showNewBadge(item.isNew)
        loadoutRows.push(row)
      }
    })
    this.list.setRows(loadoutRows)
  }

  addItem(item){
    if(!item){
      return
    }
    const row = new LoadoutRow()
    row.setItem(item)
    this.list.addRow(row)
  }

  removeItem(item){
    const row = this.list.findRow(row => row.item === item)
    this.list.removeRow(row)
  }
}

customElements.define('di-inventory', Inventory)