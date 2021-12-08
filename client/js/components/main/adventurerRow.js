export default class AdventurerRow extends HTMLButtonElement {
  constructor(adventurer){
    super()
    this.classList.add('adventurer-row')
    if(adventurer){
      this.adventurer = adventurer
    }else{
      this.innerHTML = 'Create a new Adventurer'
    }
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })