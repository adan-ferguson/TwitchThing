const HTML = `
<div>Something</div>
`

export default class LoadoutRow extends HTMLElement{

  constructor(item){
    super()
    this.item = item
    this.innerHTML = HTML
  }

}

customElements.define('di-loadout-row', LoadoutRow)