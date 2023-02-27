import DIElement from '../../diElement.js'

const HTML = ''

export default class EditPoints extends DIElement{

  constructor(){
    super()
    this.innerHTML = HTML
  }

  async show(parentPage){
    
  }
}
customElements.define('di-edit-points', EditPoints)