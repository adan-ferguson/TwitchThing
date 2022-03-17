import CustomAnimation from '../../../customAnimation.js'

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
    this.xp = this.querySelector('.xp-reward')
  }

  updateDungeonRun(dungeonRun, animate){
    this.querySelector('.floor').textContent = dungeonRun.floor
    this.querySelector('.room').textContent = dungeonRun.room

    this._setXP(dungeonRun.rewards.xp, animate)

    this.timer.time = dungeonRun.elapsedTime
    this.timer.start()
  }

  _setXP(xp, animate){

    if(this._xpAnimation){
      this._xpAnimation.cancel()
      this._xpAnimation = null
    }

    if(!animate){
      this.xp.textContent = xp
      return
    }

    const prevVal = parseInt(this.xp.textContent)

    this.animation = new CustomAnimation({
      duration: 1500,
      easing: 'easeOut',
      cancel: () => {
        this._xpAnimation = null
      },
      finish: () => {
        this._xpAnimation = null
      },
      tick: pct => {
        this.xp.textContent = '' + Math.round(prevVal * (1 - pct) + xp * pct)
      }
    })
  }
}

customElements.define('di-dungeon-state', State)