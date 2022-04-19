const HTML = `Mo
<div class='underlay'></div>
<div class='inner-pane'></div>
`

export default class Modal extends HTMLElement{

  _options = {
    closeOnUnderlayClick: true
  }

  constructor(){
    super()
    this.classList.add('modal')
    this.innerHTML = HTML
    this.underlay = this.querySelector('.underlay')
    this.underlay.addEventListener('click', () => {
      if(!this._options.closeOnUnderlayClick){
        return
      }
      this.hide()
    })
    this.innerPane = this.querySelector('.inner-pane')
  }

  setOptions(options = {}){
    for (let key in options){
      if(key in this._options){
        this._options[key] = options[key]
      }
    }
  }

  show = () => {
    document.body.appendChild(this)
  }

  hide = () => {
    document.body.removeChild(this)
  }
}
customElements.define('di-modal', Modal)