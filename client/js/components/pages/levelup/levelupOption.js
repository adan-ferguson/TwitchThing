import DIElement from '../../diElement.js'
import EffectDetails from '../../effectDetails.js'
import BonusInstance from '../../../../../game/bonusInstance.js'
import { makeEl } from '../../../../../game/utilFunctions.js'

const HTML = `
<div class="bonus-current displaynone"></div>
<div class="bonus-arrow displaynone">
  <i class="fa-solid fa-arrow-right"></i>
</div>
<div class="bonus-next"></div>
`

export default class LevelupOption extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
  }

  setCurrent(bonus){
    const bi = new BonusInstance(bonus)
    const el = this.querySelector('.bonus-current')
    el.classList.remove('displaynone')
    populateBonusInfo(el, bi)

    this.querySelector('.bonus-arrow').classList.remove('displaynone')
  }

  setNext(bonus){
    const bi = new BonusInstance(bonus)
    const el = this.querySelector('.bonus-next')
    populateBonusInfo(el, bi)

    // TODO: set color of this
  }
}

customElements.define('di-levelup-option', LevelupOption)

function populateBonusInfo(target, bonusInstance){

  const text = (bonusInstance.upgradable ? `Lvl. ${bonusInstance.level} ` : '') + bonusInstance.displayName

  target.appendChild(makeEl({
    text: text,
    class: 'bonus-name'
  }))

  target.appendChild(new EffectDetails().setEffect(bonusInstance))
}