import DIElement from '../../diElement.js'

export default class Scrapyard extends DIElement{
  setData(data){
    this.style.height = '100%'
  }
}
customElements.define('di-workshop-scrapyard', Scrapyard)