import { fillArray, makeEl, wait } from '../../../../../game/utilFunctions.js'
import { getChestDisplayInfo } from '../../../displayInfo/chestDisplayInfo.js'
import DIElement from '../../diElement.js'
import { ICON_SVGS } from '../../../assetLoader.js'
import AdventurerItem from '../../../../../game/items/adventurerItem.js'
import AdventurerItemRow from '../../adventurer/adventurerItemRow.js'
import { standardItemSort } from '../../listHelpers.js'

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

export default class ChestOpenage extends DIElement{

  constructor(chest, opened = false){
    super()
    this._chest = chest
    const chestDisplayInfo = getChestDisplayInfo(chest)
    this.style.color = chestDisplayInfo.color

    if(!opened){
      this._setupUnopened()
    }else{
      this.open(false)
    }
  }

  async open(animate = true){

    if(this.classList.contains('opened')){
      return
    }

    this.classList.remove('clickable', 'glow-natural')
    this.innerHTML = OPENED_HTML

    if(animate){
      const fo = makeEl({
        class: 'fading-overlay'
      })
      this.appendChild(fo)
      await wait()
      setTimeout(() => {
        fo.remove()
      }, 1000)
    }

    this.classList.add('opened')
    this.dispatchEvent(new CustomEvent('opened'))

    const displayInfo = getChestDisplayInfo(this._chest)

    let text = ''
    if(this._chest.options.level){
      text += `Lvl. ${this._chest.options.level} `
    }

    this.querySelector('.inset-title').textContent = text + `${displayInfo.displayName} Chest`

    const contents = this.querySelector('.contents')
    if(this._chest.contents.gold){
      contents.appendChild(makeEl({
        content: `${ICON_SVGS.gold}<span> +${this._chest.contents.gold}</span>`,
        class: 'gold-contents'
      }))
    }

    const basicItems = arrayOfItems(this._chest.contents.items?.basic ?? [])
    const rows = basicItems
      .map(({ name, count }) => {
        const item = new AdventurerItem(name)
        return new AdventurerItemRow().setOptions({ item, count })
      })
      .sort((a,b) => {
        return b.adventurerItem.rarity - a.adventurerItem.rarity
      })

    rows.forEach(row => contents.appendChild(row))

    this.events.emit('opened')
  }

  _setupUnopened(){
    const displayInfo = getChestDisplayInfo(this._chest)
    this.innerHTML = UNOPENED_HTML
    const starsHTML = fillArray(() => displayInfo.icon, displayInfo.stars ?? 0).join('')
    this.querySelectorAll('.stars').forEach(el => {
      el.innerHTML = starsHTML
    })
    this.classList.add('clickable', 'glow-natural')
    this.addEventListener('click', () => this.open())
  }
}

customElements.define('di-chest-openage', ChestOpenage)

function arrayOfItems(obj){
  const arr = []
  for(let name in obj){
    arr.push({
      name,
      count: obj[name]
    })
  }
  return arr.sort((a, b) => a.orbs - b.orbs)
}