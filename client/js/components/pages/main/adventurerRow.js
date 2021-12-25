const HTML = `
Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span>
`

export default class AdventurerRow extends HTMLButtonElement {
  constructor(adventurer){
    super()
    this.classList.add('adventurer-row')
    if(!adventurer) {
      this.innerHTML = 'Create a new Loadout'
      return
    }

    this.adventurer = adventurer
    this.innerHTML = HTML
    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = adventurer.level

    if(adventurer.currentVenture){
      // More info
      this.querySelector('.status').textContent = adventurer.currentVenture.status
    }
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })