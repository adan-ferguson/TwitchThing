import CustomAnimation from '../../../animations/customAnimation.js'
import { minMax, suffixedNumber } from '../../../../../game/utilFunctions.js'
import NumberChanger from '../../numberChanger.js'

const innerHTML = `
<div class="content flex-columns">
  <div>
    <div class="floor-and-room"></div>
    <div class="pace-and-rest"></div>
    <div class="resting-yes">
      Food: <span class="food">0</span>/<span class="max-food">0</span>
    </div>
  </div>
  <div>
    <div>
      XP: <span class="xp-reward">0</span>
    </div>
    <div class="gold-yes">
      Gold: <span class="gold-reward">0</span>
    </div>
    <div>
      Chests: <span class="chests">0</span>
    </div>
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
    this._chests = this.querySelector('.chests')
    this._food = this.querySelector('.food')

    this._xpChanger = new NumberChanger(this.querySelector('.xp-reward'))
    this._goldChanger = new NumberChanger(this.querySelector('.gold-reward'))
  }

  get maxFoodEl(){
    return this.querySelector('.max-food')
  }

  setup(dungeonRun, user){
    let paceAndRest = dungeonRun.dungeonOptions.pace ?? 'Brisk'
    if(dungeonRun.dungeonOptions.restThreshold > 0){
      paceAndRest += `, Rest when HP < ${dungeonRun.dungeonOptions.restThreshold}%`
    }else{
      this.querySelectorAll('.resting-yes').forEach(el => el.classList.add('displaynone'))
    }
    this.querySelector('.pace-and-rest').textContent = paceAndRest

    if(!user.features.gold){
      this.querySelectorAll('.gold-yes').forEach(el => el.classList.add('displaynone'))
    }
  }

  update(event, run, adventurerInstance, animate){

    const floor = event?.floor ?? run.floor
    const room = event?.room ?? run.room
    this._floorAndRoomEl.textContent = `Floor ${floor} - ${room ? 'Room ' + room : 'Entrance'}`

    const rewards = event?.rewardsToDate ?? run.rewards ?? {}
    this._xpChanger.set(rewards.xp ?? 0, animate)
    this._goldChanger.set(rewards.gold ?? 0, animate)
    this._updateChests(rewards.chests ?? 0, animate)

    // TODO: still is bugged
    this._setFoodRemaining(adventurerInstance.food, adventurerInstance.maxFood)

    this._contentEl.classList.remove('displaynone')
  }

  /**
   * @param chests
   * @param animate
   * @private
   */
  _updateChests(chests, animate){
    // TODO: animate
    const amount = Array.isArray(chests) ? chests.length : (chests || 0)
    this._chests.textContent = amount + ''
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