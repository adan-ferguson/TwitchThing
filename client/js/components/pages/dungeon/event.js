const innerHTML = ''

export default class Event extends HTMLElement {
  constructor(){
    super()
    this.innerHTML = innerHTML
  }
  update(event){

  }
}

customElements.define('di-dungeon-event', Event)