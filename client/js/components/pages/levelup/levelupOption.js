import DIElement from '../../diElement.js'
import EffectDetails from '../../effectDetails.js'
import BonusInstance from '../../../../../game/bonusInstance.js'
import { makeEl } from '../../../../../game/utilFunctions.js'
import OrbRow, { OrbsDisplayStyle } from '../../orbRow.js'
import classDisplayInfo from '../../../classDisplayInfo.js'

const HTML = `
<div class="bonus-description bonus-current displaynone"></div>
<div class="bonus-arrow displaynone">
  <i class="fa-solid fa-arrow-right"></i>
</div>
<div class="bonus-description bonus-next"></div>
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
  }
}

customElements.define('di-levelup-option', LevelupOption)

function populateBonusInfo(target, bonusInstance){

  const info = classDisplayInfo(bonusInstance.group)
  target.style.color = info.color

  target.appendChild(makeEl({
    text: bonusInstance.displayName,
    class: 'bonus-name'
  }))

  const orbRow = new OrbRow().setOptions({ style: OrbsDisplayStyle.MAX_ADDITIVE }).setData(bonusInstance.orbsData)
  orbRow.classList.add('bonus-orbs')
  target.appendChild(orbRow)

  target.appendChild(new EffectDetails().setEffect(bonusInstance))
}