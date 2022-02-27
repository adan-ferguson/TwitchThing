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
export default class State extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = innerHTML
    this.timer = this.querySelector('di-timer')
  }

  updateDungeonRun(dungeonRun){
    this.querySelector('.floor').textContent = dungeonRun.floor
    this.querySelector('.room').textContent = dungeonRun.room
    this.querySelector('.xp-reward').textContent = dungeonRun.rewards.xp
    this.timer.time = dungeonRun.elapsedTime
    this.timer.start()
  }
}

customElements.define('di-dungeon-state', State)