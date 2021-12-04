export default class AdventurerRow extends HTMLElement {
  constructor(adventurer){
    super()
    this.adventurer = adventurer
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow)