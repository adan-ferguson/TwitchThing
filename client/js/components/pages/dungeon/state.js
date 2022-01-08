const innerHTML = `
<di-timer></di-timer><br/>
<div>
    Floor <span class="floor"></span> - Room <span class="room"></span>
</div>
<div>
    xp: <span class="xp-reward">0</span>
</div>
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
    this.querySelector('.floor').textContent = dungeonRun.floor
    this.querySelector('.room').textContent = dungeonRun.room
    this.querySelector('.xp-reward').textContent = dungeonRun.rewards.xp
  }

  updateVenture(venture){
    // TODO: set the timer time
    this.timer.setTimeSince(venture.startTime)
    this.timer.start()
  }
}

customElements.define('di-dungeon-state', State)