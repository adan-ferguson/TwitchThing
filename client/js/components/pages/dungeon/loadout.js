const innerHTML = `

`

export default class Loadout extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  setLoadout(adventurer){

  }

  update(){

  }
}

customElements.define('di-dungeon-loadout', Loadout)