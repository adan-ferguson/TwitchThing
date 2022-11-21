import { fillArray, makeEl, toDisplayName, wait } from '../../../../../game/utilFunctions.js'
import LoadoutRow from '../../loadout/loadoutRow.js'
import FighterItemDisplayInfo from '../../../fighterItemDisplayInfo.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import { getChestDisplayInfo } from '../../../chestDisplayInfo.js'

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
    const chestDisplayInfo = getChestDisplayInfo(chest)
    this.style.color = chestDisplayInfo.color

    if(!opened){
      this.innerHTML = UNOPENED_HTML
      const starsHTML = fillArray(() => '<i class="fa-solid fa-star"></i>', chest.stars ?? 0).join('')
      this.querySelectorAll('.stars').forEach(el => {
        el.innerHTML = starsHTML
      })
      this.classList.add('clickable', 'glow')
      this.addEventListener('click', () => this.open())
    }else{
      this.open(false)
    }
  }

  async open(animate = true){

    if(this.classList.contains('opened')){
      return
    }

    this.classList.remove('clickable', 'glow')
    this.innerHTML = OPENED_HTML

    if(animate){
      this.appendChild(makeEl({
        class: 'fading-overlay'
      }))
      await wait()
    }

    this.classList.add('opened')
    this.dispatchEvent(new CustomEvent('opened'))

    const displayInfo = getChestDisplayInfo(this._chest)
    this.querySelector('.inset-title').textContent =
      `Lvl. ${this._chest.level} ${displayInfo.displayName} Chest`

    const contents = this.querySelector('.contents')
    if(this._chest.contents.gold){
      contents.appendChild(makeEl({
        text: `${this._chest.contents.gold} gold`,
        class: 'gold-amount'
      }))
    }
    this._chest.contents.items?.forEach(itemDef => {
      const row = new LoadoutRow()
      const info = new FighterItemDisplayInfo(new AdventurerItemInstance(itemDef))
      row.setItem(info)
      contents.appendChild(row)
    })
  }
}

customElements.define('di-chest-openage', ChestOpenage )