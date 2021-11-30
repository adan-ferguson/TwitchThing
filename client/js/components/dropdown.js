export function create(options, parent){
  return new Dropdown(options, parent)
}

class Dropdown extends HTMLElement{

  constructor(target, options){
    super()
    this.classList.add('dropdown-menu')
    this.target = target

    for(let key in options){
      const optionEl = document.createElement('button')
      optionEl.textContent = key
      optionEl.addEventListener('click', () => {
        options[key]()
      })
      this.appendChild(optionEl)
    }

    target.addEventListener('click', e => {
      if(this.parentNode){
        this.hide()
      }else{
        this.show()
      }
      e.stopPropagation()
    })
  }

  show = () => {
    this.target.appendChild(this)
    document.body.addEventListener('click', this.hide)
  }

  hide = () => {
    this.target.removeChild(this)
    document.body.removeEventListener('click', this.hide)
  }
}

customElements.define('di-dropdown', Dropdown)