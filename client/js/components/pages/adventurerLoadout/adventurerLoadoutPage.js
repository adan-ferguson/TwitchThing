export default class AdventurerLoadoutPage extends HTMLElement{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
  }

}

customElements.define('di-adventurer-loadout-page', AdventurerLoadoutPage)