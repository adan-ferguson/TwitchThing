const HTML = `
Lvl <span class="level"></span> - <span class="name"></span> <span class="status"></span>
`

export default class AdventurerRow extends HTMLButtonElement {
  constructor(adventurer){
    super()
    this.classList.add('adventurer-row')
    if(!adventurer) {
      this.innerHTML = 'Create a new Adventurer'
      return
    }

    this.adventurer = adventurer
    this.innerHTML = HTML
    this.querySelector('.name').textContent = adventurer.name
    this.querySelector('.level').textContent = adventurer.level

    if(adventurer.currentVenture){
      this.querySelector('.status').textContent = 'In Dungeon'
    }
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })