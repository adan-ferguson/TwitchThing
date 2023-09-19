import DIElement from './diElement.js'

const HTML = labelContent => `<label><input type="checkbox"> ${labelContent}</label>`
export default class Checkbox extends DIElement{
  constructor(){
    super()
    this.innerHTML = HTML(this.innerHTML)
  }

  get input(){
    return this.querySelector('input')
  }
}

customElements.define('di-checkbox', Checkbox)