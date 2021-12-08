const HTML = `
<div class='underlay'></div>
<div class='inner-pane'></div>
`

export default class Modal extends HTMLElement{

  constructor(content = null){
    super()
    this.classList.add('modal')
    this.innerHTML = HTML
    this.underlay = this.querySelector('.underlay')
    this.innerPane = this.querySelector('.inner-pane')

    if(content){
      this.innerPane.appendChild(content)
    }
  }

  show = () => {
    document.body.appendChild(this)
    this.underlay.addEventListener('click', this.hide)
  }

  hide = () => {
    document.body.removeChild(this)
    this.underlay.removeEventListener('click', this.hide)
  }
}
customElements.define('di-modal', Modal)