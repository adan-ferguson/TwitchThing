import Page from '../page.js'
import ShopItem from './shopItem.js'

const HTML = `
<div class='shop-items'></div>
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
        this._showModal(item)
      })
      this._shopItemsEl.appendChild()
    })
  }

  _showModal(item){

  }

}

customElements.define('di-shop-page', ShopPage)