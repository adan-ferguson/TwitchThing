import CustomAnimation from '../../../animations/customAnimation.js'
import DungeonRunResults from '../../../../../game/dungeonRunResults.js'
import { minMax, suffixedNumber } from '../../../../../game/utilFunctions.js'

const innerHTML = `
<div class="content">
  <div class="floor-and-room"></div>
  <div>
    <span class="pace"></span> Pace
  </div>
  <div class="resting-yes">
    Rest when HP below <span class="rest-threshold"></span>%
  </div>
  <div class="resting-yes">
    Food: <span class="food">0</span>/<span class="max-food">0</span>
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
    this._food = this.querySelector('.food')
  }

  get maxFoodEl(){
    return this.querySelector('.max-food')
  }

  setup(dungeonRun){
    this.querySelector('.pace').textContent = dungeonRun.dungeonOptions.pace ?? 'Brisk'
    if(dungeonRun.dungeonOptions.restThreshold > 0){
      this.querySelector('.rest-threshold').textContent = dungeonRun.dungeonOptions.restThreshold
    }else{
      this.querySelectorAll('.resting-yes').forEach(el => el.classList.add('displaynone'))
    }
  }

  update(eventsList, adventurerInstance, animate){

    const currentEvent = eventsList.at(-1)
    const results = new DungeonRunResults(eventsList)

    if(currentEvent){
      this._floorAndRoomEl.textContent = `Floor ${currentEvent.floor} - ${currentEvent.room ? 'Room ' + currentEvent.room : 'Entrance'}`
    }

    this._setXP(results.xp, animate)
    this._updateChests(results.chests, animate)

    // TODO: this is sort of a weird fundamental problem
    // if(animate){
    //   this._setFoodRemaining((currentEvent.penalty?.food ?? 0) + this._lastFood)
    //   this._setFoodRemaining((currentEvent.rewards?.food ?? 0) + this._lastFood)
    // }else{
    // }
    this._setFoodRemaining(adventurerInstance.food, adventurerInstance.maxFood)
    this._contentEl.classList.remove('displaynone')
  }

  _setXP(xp, animate){

    const prev = this._prevXpVal
    this._prevXpVal = xp

    if(!animate || prev === undefined){
      this.xp.textContent = suffixedNumber(xp)
      this._xpAnimation?.cancel()
      return
    }

    this._xpAnimation?.cancel()


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
        this.xp.textContent = suffixedNumber(Math.round(prev * (1 - pct) + xp * pct))
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

  _setFoodRemaining(food, max = this._lastFoodMax){
    food = minMax(0, food, max)
    this._food.textContent = food
    this.maxFoodEl.textContent = max
    this._lastFood = food
    this._lastFoodMax = max
  }
}

customElements.define('di-dungeon-state', State)