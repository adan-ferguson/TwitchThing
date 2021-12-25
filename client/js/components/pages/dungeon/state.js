const innerHTML = `
<div class="floor">
    Floor <span></span>
</div>
<button disabled="disabled">View Log</button>
`

/**
 * Show either the run/venture state
 */
export default class State extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
  }

  update(dungeonRun){
    this.querySelector('.floor span').textContent = dungeonRun.floor
  }
}

customElements.define('di-dungeon-state', State)