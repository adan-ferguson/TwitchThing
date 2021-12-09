import Page from '../page.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
`

export default class AdventurerPage extends Page {

  constructor(adventurer){
    super()
    this.innerHTML = HTML
    this.adventurer = adventurer
  }

  async load(){
    debugger
    const myContent = await fizzetch('/game/pagedata/adventurer', { id: this.adventurer._id })
  }
}

customElements.define('di-page-adventurer', AdventurerPage)