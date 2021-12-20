const innerHTML = ''

export default class Event extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }
}

customElements.define('di-dungeon-event', Event)