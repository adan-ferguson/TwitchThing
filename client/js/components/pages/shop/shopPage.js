import Page from '../page.js'
import ShopItem from './shopItem.js'
import ShopItemDetails from './shopItemDetails.js'
import Modal from '../../modal.js'
import fizzetch from '../../../fizzetch.js'
import ChestOpenage from '../dungeon/chestOpenage.js'

const HTML = `
<div class='shop-items content-well'></div>
`

export default class ShopPage extends Page{

  _shopItemsEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._shopItemsEl = this.querySelector('.shop-items')
  }

  static get pathDef(){
    return ['shop']
  }

  async load(){
    const { shopItems } = await this.fetchData()
    shopItems.forEach(shopItemDef => {
      const item = new ShopItem().setItem(shopItemDef)
      item.addEventListener('click', () => {
        this._showModal(shopItemDef)
      })
      this._shopItemsEl.appendChild(item)
    })
  }

  _showModal(shopItemDef){
    const modal = new Modal()
    const canBuy = this.user.inventory.gold >= shopItemDef.price.gold
    const details = new ShopItemDetails().setItem(shopItemDef, canBuy)
    details.events.on('purchased', () => {
      modal.setOptions({
        closeOnUnderlayClick: false
      })
      buy()
    })
    modal.innerContent.append(details)
    modal.show()

    async function buy(){
      const result = await fizzetch('shop/buy', {
        id: shopItemDef.id
      })
      if(result.chest){
        const openage = new ChestOpenage(result.chest)
        modal.innerContent.innerHTML = ''
        modal.appendChild(openage)
        openage.events.on('opened', () => {
          modal.setOptions({
            closeOnUnderlayClick: true
          })
        })
      }else{
        modal.innerContent.innerHTML = result.message
        modal.setOptions({
          closeOnUnderlayClick: true
        })
      }
    }
  }

}

customElements.define('di-shop-page', ShopPage)