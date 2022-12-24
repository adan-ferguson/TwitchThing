import { fillArray, makeEl, wait } from '../../../../../game/utilFunctions.js'
import LoadoutRow from '../../loadout/loadoutRow.js'
import FighterItemLoadoutItem from '../../../fighterItemLoadoutItem.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import { getChestDisplayInfo } from '../../../chestDisplayInfo.js'
import DIElement from '../../diElement.js'

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

    this.classList.remove('clickable', 'glow')
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
    this.querySelector('.inset-title').textContent =
      `Lvl. ${this._chest.level} ${displayInfo.displayName} Chest`

    const contents = this.querySelector('.contents')
    if(this._chest.contents.gold){
      contents.appendChild(makeEl({
        content: `<span class="gold-contents"><img src="/assets/icons/gold.svg"> ${this._chest.contents.gold}</span>`,
        class: 'gold-amount'
      }))
    }

    const basicItems = arrayOfItems(this._chest.contents.items.basic)
    console.log(basicItems)
    basicItems.forEach(({ itemDef, count }) => {
      const info = new FighterItemLoadoutItem(new AdventurerItemInstance(itemDef))
      const row = new LoadoutRow().setItem(info).setCount(count)
      contents.appendChild(row)
    })

    this.events.emit('opened')
  }

  _setupUnopened(){
    const displayInfo = getChestDisplayInfo(this._chest)
    this.innerHTML = UNOPENED_HTML
    const starsHTML = fillArray(() => displayInfo.icon, displayInfo.stars ?? 0).join('')
    this.querySelectorAll('.stars').forEach(el => {
      el.innerHTML = starsHTML
    })
    this.classList.add('clickable', 'glow')
    this.addEventListener('click', () => this.open())
  }
}

customElements.define('di-chest-openage', ChestOpenage )

function arrayOfItems(obj){
  const arr = []
  for(let group in obj){
    for(let name in obj[group]){
      arr.push({
        itemDef: { group, name },
        count: obj[group][name]
      })
    }
  }
  return arr
}