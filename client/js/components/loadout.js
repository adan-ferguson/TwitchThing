const HTML = `
<di-list></di-list>
`

export default class Loadout extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents')

    this.list = this.querySelector('di-list')
    this.list.setOptions({
      paginate: false,
      pageSize: 8
    })

    const items = []
    for(let i = 0; i < 8; i++){
      const blankRow = document.createElement('div')
      blankRow.classList.add('blank-row')
      items.push(blankRow)
    }
    this.list.setItems(items)
  }
}

customElements.define('di-loadout', Loadout)