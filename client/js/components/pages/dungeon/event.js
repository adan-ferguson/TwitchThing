const innerHTML = `
<div class="message"></div>
`

export default class Event extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  update(dungeonEvent){
    debugger
    if(!dungeonEvent){
      return
    }
    this.querySelector('.text').textContent = dungeonEvent.message
  }
}

customElements.define('di-dungeon-event', Event)