import DIElement from './diElement.js'

const HTML = `
<di-item-card></di-item-card>
<button class="upgrade-button">Upgrade in Workshop</button>
`

export default class ItemDetails extends DIElement{

  get defaultOptions(){
    return {
      showUpgradeButton: false
    }
  }

  get itemCard(){
    return this.querySelector('di-item-card')
  }

  get upgradeButton(){
    return this.querySelector('.upgrade-button')
  }

  setItem(itemInstance){
    this.innerHTML = HTML
    this.itemCard.setItem(itemInstance)
    this._update()
    return this
  }

  _update(){
    this.upgradeButton.classList.toggle('displaynone', true) //this._options.showUpgradeButton ? false : true)
  }
}
customElements.define('di-item-details', ItemDetails)
