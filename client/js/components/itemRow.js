import { OrbsDisplayStyle, OrbsTooltip } from './orbRow.js'

const HTML = `
<div class="flex-columns flex-centered">
  <div class="count-tab displaynone"></div>
  <span class="name"></span>
</div>
<div class="flex-columns flex-centered">
  <di-orb-row></di-orb-row>
</div>
`

export default class ItemRow extends HTMLElement{

  _iconEl
  _nameEl
  _orbRow

  constructor(){
    super()
    this.innerHTML = HTML
    this._iconEl = this.querySelector('.icon')
    this._nameEl = this.querySelector('.name')
    this._orbRow = this.querySelector('di-orb-row')
    this._orbRow.setOptions({
      style: OrbsDisplayStyle.MAX_ONLY,
      tooltip: OrbsTooltip.NONE
    })
  }

  setItem(loadoutItem = {}){
    if(!loadoutItem){
      this._blank()
      return
    }
    this._nameEl.textContent = loadoutItem.displayName
    this._orbRow.setData(loadoutItem.orbs)
    this._setTexture(loadoutItem.isBasic ? null : 'swamp')
  }

  setCount(count){
    const countEl = this.querySelector('.count-tab')
    countEl.classList.toggle('displaynone', count >= 1 ? false : true)
    countEl.textContent = 'x' + count
  }

  _blank(){
    this._nameEl.textContent = ''
    this._orbRow.setData([])
    this._setTexture(null)
  }

  _setTexture(name){
    if(!name){
      this.style.backgroundImage = null
    }else{
      this.style.backgroundImage = `url('/assets/textures/${name}.png')`
    }
  }
}

customElements.define('di-item-row', ItemRow)