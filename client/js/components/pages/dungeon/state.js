import CustomAnimation from '../../../customAnimation.js'

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
<a target="_blank" class="share-link">Permalink</a>
`

export default class State extends HTMLElement{

  _chests
  _shareLink

  constructor(){
    super()
    this.innerHTML = innerHTML
    this.timer = this.querySelector('di-timer')
    this.xp = this.querySelector('.xp-reward')
    this.xpVal = null
    this._chests = this.querySelector('.chests')
    this._shareLink = this.querySelector('.share-link')
  }

  updateDungeonRun(dungeonRun, animate){
    this.querySelector('.floor').textContent = dungeonRun.floor
    this.querySelector('.room').textContent = dungeonRun.room

    this._setXP(dungeonRun, animate)
    this._updateChests(dungeonRun.rewards.chests, animate)

    this.timer.time = dungeonRun.virtualTime || dungeonRun.elapsedTime
    if(dungeonRun.finished){
      this.timer.stop()
    }else{
      this.timer.start()
    }

    this._shareLink.setAttribute('href', '/watch/dungeonrun/' + dungeonRun._id)
  }

  _setXP(dungeonRun, animate){

    const total = dungeonRun.rewards.xp
    const reward = dungeonRun.currentEvent?.rewards?.xp

    if(!animate || !reward){
      this.xp.textContent = total
      this._xpAnimation?.cancel()
      return
    }

    this._xpAnimation?.cancel()

    const prevVal = total - reward
    this._xpAnimation = new CustomAnimation({
      duration: 1500,
      easing: 'easeOut',
      cancel: () => {
        this._xpAnimation = null
      },
      finish: () => {
        this._xpAnimation = null
      },
      tick: pct => {
        this.xp.textContent = '' + Math.round(prevVal * (1 - pct) + total * pct)
      }
    })
  }

  _updateChests(chests, animate){
    this._chests.textContent = (chests?.length || 0) + ''
  }
}

customElements.define('di-dungeon-state', State)