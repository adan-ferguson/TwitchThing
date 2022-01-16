import '../bar.js'

const HTML = `
<div class="health">Other stats here</div>
`

export default class StatsBox extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
  }
}

customElements.define('di-adventurer-statsbox', StatsBox)