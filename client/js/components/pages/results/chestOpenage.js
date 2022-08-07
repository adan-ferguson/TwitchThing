import CHESTS from '../../../chestDisplayInfo.js'
import { fillArray, makeEl, wait } from '../../../../../game/utilFunctions.js'
import ItemDetails from '../../itemDetails.js'

const UNOPENED_HTML = `
<span class="unopened">
  <span class="stars"></span>
  <span class="open-me">
    Open Me
  </span>
  <span class="stars"></span>
</span>
`

const OPENED_HTML = `
<div class='description'></div>
<div class="contents"
`

export default class ChestOpenage extends HTMLElement{

  constructor(chest, opened = false){
    super()
    const chestDisplayInfo = CHESTS[chest.tier]
    this.style.color = chestDisplayInfo.color

    if(!opened){
      this.innerHTML = UNOPENED_HTML
      const starsHTML = fillArray(() => '<i class="fa-solid fa-star"></i>', chest.tier).join('')
      this.querySelectorAll('.stars').forEach(el => {
        el.innerHTML = starsHTML
      })
      this.classList.add('clickable')
      this.addEventListener('click', () => this.open(chest))
    }else{
      this.open(chest, false)
    }
  }

  async _open(chest, animate = false){
    if(this._opened){
      return
    }
    this._opened = true
    this.classList.remove('clickable')

    this.innerHTML = OPENED_HTML

    if(animate){
      this.appendChild(makeEl({
        class: 'fading-overlay'
      }))
    }

    const displayInfo = CHESTS[chest.tier]
    this.querySelector('.description').textConten =
      `Lvl. ${chest.level} ${displayInfo.displayName} Chest`

    const contents = this.querySelector('.contents')
    chest.contents.items?.forEach(item => {
      contents.appendChild(new ItemDetails(item))
    })
  }
}

customElements.define('di-chest-openage', ChestOpenage )