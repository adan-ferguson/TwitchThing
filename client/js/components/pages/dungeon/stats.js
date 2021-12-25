const innerHTML = `
<div class="name"></div>
<div class="health">Health here</div>
`

export default class Stats extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  setAdventurer(adventurer){
    this.querySelector('.name').textContent = adventurer.name
  }

  update(){

  }
}

customElements.define('di-dungeon-stats', Stats)