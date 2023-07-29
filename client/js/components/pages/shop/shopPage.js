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
    this._setupItems(shopItems)
  }

  _showModal(shopItemDef){
    const modal = new Modal()
    const details = new ShopItemDetails().setItem(shopItemDef, this.user.inventory.gold)
    details.events.on('purchased', count => {
      if(!count){
        modal.hide()
        return
      }
      modal.setOptions({
        closeOnUnderlayClick: false
      })
      buy(count)
    })
    modal.innerContent.append(details)
    modal.show()

    const buy = async (count) => {
      const { result, newShop } = await fizzetch('shop/buy', {
        id: shopItemDef.id,
        count
      })
      if(result.chest){
        const openage = new ChestOpenage(result.chest)
        modal.innerContent.innerHTML = ''
        modal.innerContent.appendChild(openage)
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
      this._setupItems(newShop)
    }
  }

  _setupItems(shopItems){
    this._shopItemsEl.innerHTML = ''
    shopItems.forEach(shopItemDef => {
      const item = new ShopItem().setItem(shopItemDef)
      item.addEventListener('click', () => {
        this._showModal(shopItemDef)
      })
      this._shopItemsEl.appendChild(item)
    })
  }

}

customElements.define('di-shop-page', ShopPage)