import { suffixedNumber } from '../../../game/utilFunctions.js'
import CustomAnimation from '../animations/customAnimation.js'

export default class NumberChanger{

  _prevVal
  _animation

  constructor(el){
    this._el = el
  }

  set(newVal, animate = false){
    const prev = this._prevVal
    this._prevVal = newVal

    if (!animate || prev === undefined){
      this._el.textContent = suffixedNumber(newVal)
      this._animation?.cancel()
      return
    }

    this._animation?.cancel()

    this._animation = new CustomAnimation({
      duration: 1500,
      easing: 'easeOut',
      cancel: () => {
        this._animation = null
      },
      finish: () => {
        this._animation = null
      },
      tick: pct => {
        this._el.textContent = suffixedNumber(Math.round(prev * (1 - pct) + newVal * pct))
      }
    })
  }
}