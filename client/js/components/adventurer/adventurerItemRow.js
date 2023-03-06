import DIElement from '../diElement.js'

const HTML = `
<div class="border">
  <div class="flex-columns flex-centered">
    <div class="count-tab displaynone"></div>
    <span class="name"></span>
  </div>
  <div class="flex-columns flex-centered">
    <di-orb-row></di-orb-row>
  </div>
</div>
<div class="hit-area"></div>
`

export default class AdventurerItemRow extends DIElement{

  _item

  constructor(){
    debugger
    super()
    this.innerHTML = HTML
    this._blank()
  }

  get countEl(){
    return this.querySelector('.count-tab')
  }

  get nameEl(){
    return this.querySelector('.name')
  }

  get orbRow(){
    return this.querySelector('di-orb-row')
  }

  setItem(adventurerItem){
    if(!adventurerItem){
      this._blank()
    }else{
      this.nameEl.textContent = adventurerItem.displayName
      this.orbRow.setData(adventurerItem.orbs)
      this._setTexture(adventurerItem.isBasic ? null : 'maze-white')
    }
    return this
  }

  setCount(count){
    this.countEl.classList.toggle('displaynone', count >= 1 ? false : true)
    this.countEl.textContent = 'x' + count
  }

  _blank(){
    this.nameEl.textContent = ''
    this.orbRow.setData([])
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