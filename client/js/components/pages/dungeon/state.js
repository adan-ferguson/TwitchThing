const innerHTML = ''

/**
 * Show either the run/venture state
 */
export default class State extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  update(state){

  }

}

customElements.define('di-dungeon-state', State)