export default class Loadout extends HTMLElement {
  constructor(adventurer){
    super()
    for(let i = 0; i < 8; i++){
      this._addRow()
    }
  }

  _addRow(){
    // TODO: real row
    this.appendChild(document.createElement('div'))
  }
}

customElements.define('di-loadout', Loadout)