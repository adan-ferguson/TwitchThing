export function confirm(message, buttons){
  const modal = new Modal()
  modal.content.innerHTML = message
  buttons.forEach(button => modal.addButton(button))
  modal.show()
}

const HTML = `
<div class='underlay'></div>
<div class='inner-pane'>
  <div class='content'></div>
  <div class='buttons'></div>
</div>
`

class Modal extends HTMLElement{

  constructor() {
    super()
    this.classList.add('modal')
    this.innerHTML = HTML
    this.underlay = this.querySelector('.underlay')
    this.content = this.querySelector('.content')
    this.buttons = this.querySelector('.buttons')
  }

  addButton(options){
    options = {
      text: 'text',
      style: 'normal',
      fn: () => {}, // Called on click. If it returns false, the modal won't close after clicking.
      ...options
    }

    const btn = document.createElement('button')
    btn.classList.add('style-' + options.style)
    btn.textContent = options.text
    btn.addEventListener('click', () => {
      const ret = options.fn()
      if(ret !== false){
        this.hide()
      }
    })
    this.buttons.appendChild(btn)
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