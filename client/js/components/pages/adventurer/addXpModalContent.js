import DIElement from '../../diElement.js'
import { faIcon, xpIcon } from '../../common.js'
import { advLevelToXp, advXpToLevel } from '../../../../../game/adventurer.js'

const HTML = `
<di-xp-bar></di-xp-bar>
<div class="flex-columns slider-controls">
  <button class="minus"><i class="fa-solid fa-minus"></i></button>
  <input class='xp-to-add flex-grow' type="range" min="0" value="0"/>
  <button class="plus"><i class="fa-solid fa-plus"></i></button>
</div>
<div class="flex-columns xp-numbers">
  <span><span class="xp-remaining number"></span>${xpIcon()}</span>
  ${faIcon('arrow-right')}
  <span><span class="xp-spent number"></span>${xpIcon()}</span>
</div>
`

export default class AddXpModalContent extends DIElement{
  constructor(user, adventurer){
    super()
    this._user = user
    this._adventurer = adventurer
    this.innerHTML = HTML
    this.xpEl
      .setLevelFunctions(advXpToLevel, advLevelToXp)
      .setValue(adventurer.xp)
    this.sliderEl.setAttribute('max', user.inventory.stashedXp)
    this.sliderEl.addEventListener('input', () => {
      this._updateNumbers()
    })
    this.querySelector('.minus').addEventListener('click', () => {
      if(!this.xpEl.pct){
        this._setTotalXp(advLevelToXp(this.xpEl.level - 1))
      }else{
        this._setTotalXp(this.xpEl._options.min)
      }
    })
    this.querySelector('.plus').addEventListener('click', () => {
      this._setTotalXp(this.xpEl._options.max)
    })
    this._updateNumbers()
  }

  get xpEl(){
    return this.querySelector('di-xp-bar')
  }

  get xpRemainingEl(){
    return this.querySelector('.xp-remaining')
  }

  get xpSpentEl(){
    return this.querySelector('.xp-spent')
  }

  get sliderEl(){
    return this.querySelector('input.xp-to-add')
  }

  get val(){
    return parseInt(this.sliderEl.value)
  }

  _updateNumbers(){
    this.xpRemainingEl.textContent = this._user.inventory.stashedXp - this.val
    this.xpSpentEl.textContent = this.val
    this.xpEl.setValue(this._adventurer.xp + this.val)
  }

  _setTotalXp(xp){
    this.sliderEl.value = xp - this._adventurer.xp
    this._updateNumbers()
  }
}

customElements.define('di-add-xp-modal-content', AddXpModalContent)