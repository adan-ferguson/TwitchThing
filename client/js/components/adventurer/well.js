const HTML = `
 <di-adventurer-statsbox></di-adventurer-statsbox>
 <di-loadout></di-loadout>
`

export default class AdventurerWell extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('flex-rows')
    this.statsbox = this.querySelector('di-adventurer-statsbox')
    this.loadout = this.querySelector('di-loadout')
    this.displayMode = 'normal'
  }

  setDisplayMode(displayMode){
    this.displayMode = displayMode
    this.statsbox.setDisplayMode(displayMode)
    this.loadout.setDisplayMode(displayMode)
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this.statsbox.setAdventurer(adventurer)
    // TODO: loadout
  }
}
customElements.define('di-adventurer-well', AdventurerWell )