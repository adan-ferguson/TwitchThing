const HTML = `
Lvl <span class="level"></span> - <span class="name"></span>
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
    // TODO: show status
  }
}

customElements.define('di-main-adventurer-row', AdventurerRow, { extends: 'button' })