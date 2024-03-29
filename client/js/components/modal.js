const HTML = `
<div class='underlay'></div>
<div class='inner-pane'>
  <div class="close-button"><i class="fa-solid fa-xmark"></i></div>
  <div class="inner-content"></div>
</div>
`

let currentModal

export default class Modal extends HTMLElement{

  _options = {
    closeOnUnderlayClick: true
  }

  constructor(content = null){
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
    this._closeButton = this.querySelector('.close-button')
    this._closeButton.addEventListener('click', () => {
      this.hide()
    })
    this.innerContent = this.querySelector('.inner-content')
    if(content){
      this.innerContent.append(content)
    }
  }

  setOptions(options = {}){
    for (let key in options){
      if(key in this._options){
        this._options[key] = options[key]
      }
    }
    this._closeButton.classList.toggle('displaynone', !this._options.closeOnUnderlayClick)
    return this
  }

  show = () => {
    if(!currentModal){
      document.body.appendChild(this)
    }else{
      console.error('double modal DARK mode')
    }
    currentModal = this
    return this
  }

  hide = (result = null) => {
    currentModal = null
    this.remove()
    this.dispatchEvent(new CustomEvent('hide', {
      detail: {
        result
      }
    }))
  }
}
customElements.define('di-modal', Modal)