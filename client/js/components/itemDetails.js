const HTML = `
`

export default class ItemDetails extends HTMLElement{

  constructor(item = null){
    super()
    this.innerHTML = HTML
    if(item){
      this.setItem(item)
    }
  }

  setItem(){

  }
}

customElements.define('di-item-details', ItemDetails )