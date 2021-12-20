const innerHTML = ''

export default class Adventurer extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }
}

customElements.define('di-dungeon-adventurer', Adventurer)