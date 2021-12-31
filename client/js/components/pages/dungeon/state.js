const innerHTML = `
<div class="floor">
    Floor <span></span>
</div>
<di-timer></di-timer><br/>
<button disabled="disabled">View Log</button>
`

/**
 * Show either the run/venture state
 */
export default class State extends HTMLElement {

  constructor(){
    super()
    this.innerHTML = innerHTML
    this.timer = this.querySelector('di-timer')
  }

  updateDungeonRun(dungeonRun){
    this.querySelector('.floor span').textContent = dungeonRun.floor
  }

  updateVenture(venture){
    // TODO: set the timer time
    this.timer.setTimeSince(venture.startTime)
    this.timer.start()
  }
}

customElements.define('di-dungeon-state', State)