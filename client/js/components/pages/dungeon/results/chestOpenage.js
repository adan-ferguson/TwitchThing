import ItemDetails from '../../../itemDetails.js'

const HTML = `
<h3>Opening Chests</h3>
<div class="chest-description">
    Lv. <span class="level"></span> <span class="name"></span>
</div>
<div class="contents"></div>
`

export default class ChestOpenage extends HTMLElement{

  _description
  _level
  _name
  _contents

  constructor(chest = null){
    super()
    this.innerHTML = HTML
    this._description = this.querySelector('.chest-description')
    this._level = this.querySelector('.level')
    this._name = this.querySelector('.name')
    this._contents = this.querySelector('.contents')
    if(chest){
      this.setChest(chest)
    }
  }

  setChest(chest){
    this.setAttribute('tier', chest.tier)
    this._level.textContent = chest.level
    this._name.textContent = chest.name
    chest.contents.items?.forEach(item => {
      // TODO: more than just items
      this._contents.appendChild(new ItemDetails(item))
    })
  }
}

customElements.define('di-chest-openage', ChestOpenage )