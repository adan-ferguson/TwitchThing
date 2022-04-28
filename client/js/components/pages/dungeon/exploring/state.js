import CustomAnimation from '../../../../customAnimation.js'

const innerHTML = `
<di-timer></di-timer><br/>
<div>
    Floor <span class="floor"></span> - Room <span class="room"></span>
</div>
<div>
    XP: <span class="xp-reward">0</span>
</div>
<div>
    Chests: <span class="chests">0</span>
</div>
`

/**
 * Show either the run/venture state
 */
export default class State extends HTMLElement{

  _chests

  constructor(){
    super()
    this.innerHTML = innerHTML
    this.timer = this.querySelector('di-timer')
    this.xp = this.querySelector('.xp-reward')
    this.xpVal = null
    this._chests = this.querySelector('.chests')
  }

  updateDungeonRun(dungeonRun, animate){
    this.querySelector('.floor').textContent = dungeonRun.floor
    this.querySelector('.room').textContent = dungeonRun.room

    this._setXP(dungeonRun.rewards.xp, animate)
    this._updateChests(dungeonRun.rewards.chests, animate)

    this.timer.time = dungeonRun.virtualTime
    this.timer.start()
  }

  _setXP(xp){

    const prevVal = this.xpVal
    this.xpVal = xp = xp || 0

    if(xp === prevVal){
      return
    }

    if(this._xpAnimation){
      this._xpAnimation.cancel()
      this._xpAnimation = null
    }

    if(prevVal === null){
      this.xp.textContent = this.xpVal
      return
    }

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
        this.xp.textContent = '' + Math.round(prevVal * (1 - pct) + this.xpVal * pct)
      }
    })
  }

  _updateChests(chests, animate){
    this._chests.textContent = (chests?.length || 0) + ''
  }
}

customElements.define('di-dungeon-state', State)