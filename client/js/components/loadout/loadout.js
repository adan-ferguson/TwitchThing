import LoadoutRow from './loadoutRow.js'

const HTML = `
<div class="flex-rows">
  <div>Orbs</div>
  <di-list></di-list>
</div>
`

export default class Loadout extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents')

    this.list = this.querySelector('di-list')
    this.list.setOptions({
      paginate: false,
      pageSize: 8
    })

    this._updateRows()
  }

  setLoadout(adventurer){
    this._updateRows(adventurer.loadout)
  }

  _updateRows(items = []){
    const rows = []
    for(let i = 0; i < 8; i++){
      const item = items[i] || null
      if(!item){
        const blankRow = document.createElement('div')
        blankRow.classList.add('blank-row')
        rows.push(blankRow)
      }else{
        const loadoutRow = new LoadoutRow(item)
        rows.push(loadoutRow)
      }
    }
    this.list.setItems(rows)
  }
}

customElements.define('di-loadout', Loadout)