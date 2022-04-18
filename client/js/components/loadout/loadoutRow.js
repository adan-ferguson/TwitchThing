import tippy from 'tippy.js'
import orbImg from '/client/assets/icons/orb.svg'

const HTML = (name, orbs, icon = '') => `
<div>
    <span>${icon}</span> <span>${name}</span>
</div>
<div class="orb-row">
    <img alt="Orbs" src="${orbImg}"> <span class="orbs-text">${orbs}</span>
</div>
`

export default class LoadoutRow extends HTMLElement{
  constructor(index = -1, item = null){
    super()
    this.tippy = tippy(this)
    this.index = index
    this.setItem(item)
  }

  get itemTooltip(){
    if(!this.item){
      return ''
    }
    return JSON.stringify(this.item.stats)
  }

  setItem(item){
    if(!item){
      return this._setupBlank()
    }
    this.classList.remove('blank-row')
    this.item = item
    this.innerHTML = HTML(item.name, item.orbs)
    this.tippy.enable()
    this.tippy.setContent(() => this.itemTooltip)
  }

  _setupBlank(){
    this.classList.add('blank-row')
    this.item = null
    this.innerHTML = ''
    this.tippy.disable()
  }
}

customElements.define('di-loadout-row', LoadoutRow)