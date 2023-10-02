import { arrayize, fillArray, makeEl, wait } from '../../../../../game/utilFunctions.js'
import { getChestDisplayInfo } from '../../../displayInfo/chestDisplayInfo.js'
import DIElement from '../../diElement.js'
import { consolidatedChestList } from '../../listHelpers.js'

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

  constructor(chests, opened = false){
    super()
    this._chests = arrayize(chests)
    this.style.color = getChestDisplayInfo(chests).color

    if(!opened){
      this._setupUnopened()
    }else{
      this.open(false)
    }
  }

  get contentsEl(){
    return this.querySelector('.contents')
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

    const displayInfo = getChestDisplayInfo(this._chests)
    this.querySelector('.inset-title').textContent = displayInfo.displayName

    this._addGold()

    const list = consolidatedChestList(this._chests)
    this.contentsEl.appendChild(list)
    this.events.emit('opened')
  }

  _addGold(){
    // TODO: If chests with gold come back, fix this
    // if(this._chest.contents.gold){
    //   this.contentsEl.appendChild(makeEl({
    //     content: `${ICON_SVGS.gold}<span> +${this._chest.contents.gold}</span>`,
    //     class: 'gold-contents'
    //   }))
    // }
  }

  _setupUnopened(){
    const displayInfo = getChestDisplayInfo(this._chests)
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