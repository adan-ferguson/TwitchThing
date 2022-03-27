import LoadoutRow from './loadoutRow.js'

const HTML = `
<div class="flex-rows">
    <div class="filtering-options"></div>
    <di-list></di-list>
</div>
`

export default class Inventory extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML

    this.filteringOptions = this.querySelector('.filteringOptions')
    this.list = this.querySelector('di-list')
  }

  setItems(items){
    // const rows = []
    // for(let i = 0; i < 8; i++){
    //   const item = items[i] || null
    //   if(!item){
    //     const blankRow = document.createElement('div')
    //     blankRow.classList.add('blank-row')
    //     rows.push(blankRow)
    //   }else{
    //     const loadoutRow = new LoadoutRow(item)
    //     rows.push(loadoutRow)
    //   }
    // }
    // this.list.setItems(rows)
  }
}