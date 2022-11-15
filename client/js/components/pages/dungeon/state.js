import CustomAnimation from '../../../animations/customAnimation.js'
import DungeonRunResults from '../../../../../game/dungeonRunResults.js'

const innerHTML = `
<div class="content">
  <div class="floor-and-room"></div>
  <div>
    <span class="pace"></span> Pace
  </div>
  <div>
      XP: <span class="xp-reward">0</span>
  </div>
  <div>
      Chests: <span class="chests">0</span>
  </div>
</div>
`

export default class State extends HTMLElement{

  _chests
  _shareLink

  _floorEl
  _roomEl

  constructor(){
    super()
    this.innerHTML = innerHTML
    this._floorAndRoomEl = this.querySelector('.floor-and-room')
    this._contentEl = this.querySelector('.content')
    this.xp = this.querySelector('.xp-reward')
    this.xpVal = null
    this._chests = this.querySelector('.chests')
  }

  setup(dungeonRun){
    this.querySelector('.pace').textContent = dungeonRun.dungeonOptions.pace ?? 'Brisk'
  }

  update(eventsList, animate){

    const currentEvent = eventsList.at(-1)
    const results = new DungeonRunResults(eventsList)

    if(currentEvent){
      this._floorAndRoomEl.textContent = `Floor ${currentEvent.floor} - ${currentEvent.room ? 'Room ' + currentEvent.room : 'Entrance'}`
    }

    this._setXP(results.xp, animate)
    this._updateChests(results.chests, animate)

    this._contentEl.classList.remove('displaynone')
  }

  _setXP(xp, animate){

    if(!animate){
      this.xp.textContent = xp + ''
      this._xpAnimation?.cancel()
      return
    }

    this._xpAnimation?.cancel()

    const prevVal = parseInt(this.xp.textContent)

    // TODO: make a text animation helper
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
        this.xp.textContent = '' + Math.round(prevVal * (1 - pct) + xp * pct)
      }
    })
  }

  /**
   * @param chests
   * @param animate
   * @private
   */
  _updateChests(chests, animate){
    // TODO: animate
    this._chests.textContent = (chests?.length || 0) + ''
  }
}

customElements.define('di-dungeon-state', State)