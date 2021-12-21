const innerHTML = ''

export default class Adventurer extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  setAdventurer(adventurer){

  }

  update(adventurerState){

  }
}

customElements.define('di-dungeon-adventurer', Adventurer)