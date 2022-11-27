import Page from '../page.js'
import ShopItem from './shopItem.js'
import ShopItemDetails from './shopItemDetails.js'
import Modal from '../../modal.js'

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

  _showModal(shopitemDef){
    const modal = new Modal()
    const canBuy = this.user.inventory.gold >= shopitemDef.price.gold
    const details = new ShopItemDetails().setItem(shopitemDef, canBuy)
    details.events.on('purchased', () => {
      modal.setOptions({
        closeOnUnderlayClick: false
      })
      buy()
    })
    modal.innerPane.append(details)
    modal.show()

    function buy(){
      // TODO: fizzetch
      // TODO: make modal unclosable
      // TODO: replace contents with chestOpenage
      // modal.setOptions({
      //   closeOnUnderlayClick: true
      // })
    }
  }

}

customElements.define('di-shop-page', ShopPage)