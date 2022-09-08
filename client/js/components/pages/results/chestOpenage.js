import CHESTS from '../../../chestDisplayInfo.js'
import { fillArray, makeEl, wait } from '../../../../../game/utilFunctions.js'
import LoadoutRow from '../../loadout/loadoutRow.js'

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
<div class='inset-title'></div>
<div class="contents"></div>
`

export default class ChestOpenage extends HTMLElement{

  constructor(chest, opened = false){
    super()
    this._chest = chest
    const chestDisplayInfo = CHESTS[chest.tier]
    this.style.color = chestDisplayInfo.color

    if(!opened){
      this.innerHTML = UNOPENED_HTML
      const starsHTML = fillArray(() => '<i class="fa-solid fa-star"></i>', chest.tier).join('')
      this.querySelectorAll('.stars').forEach(el => {
        el.innerHTML = starsHTML
      })
      this.classList.add('clickable')
      this.addEventListener('click', () => this.open())
    }else{
      this.open(false)
    }
  }

  async open(animate = true){

    if(this.classList.contains('opened')){
      return
    }

    this.classList.remove('clickable')
    this.innerHTML = OPENED_HTML

    if(animate){
      this.appendChild(makeEl({
        class: 'fading-overlay'
      }))
      await wait()
    }

    this.classList.add('opened')
    this.dispatchEvent(new CustomEvent('opened'))

    const displayInfo = CHESTS[this._chest.tier]
    this.querySelector('.inset-title').textContent =
      `Lvl. ${this._chest.level} ${displayInfo.displayName} Chest`

    const contents = this.querySelector('.contents')
    this._chest.contents.items?.forEach(item => {
      const row = new LoadoutRow()
      row.setItem(adventurerLoadoutItem(item))
      contents.appendChild(row)
    })
  }
}

customElements.define('di-chest-openage', ChestOpenage )