const HTML = `Mo
<div class='underlay'></div>
<div class='inner-pane'></div>
`

export default class Modal extends HTMLElement{

  constructor(){
    super()
    this.classList.add('modal')
    this.innerHTML = HTML
    this.underlay = this.querySelector('.underlay')
    this.underlay.addEventListener('click', () => {
      if(this._options.closeOnUnderlayClick){
        return
      }
      this.hide()
    })
    this.innerPane = this.querySelector('.inner-pane')
  }

  setOptions(options = {}){
    this._options = {
      closeOnUnderlayClick: true,
      ...options
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