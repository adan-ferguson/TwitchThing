export function create(options, parent){
  return new Dropdown(options, parent)
}

class Dropdown extends HTMLElement{

  constructor(target, optionsFn){
    super()
    this.classList.add('dropdown-menu')
    this.target = target
    this.optionsFn = optionsFn

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

    this.innerHTML = ''

    const options = this.optionsFn()
    for(let key in options){
      const optionEl = document.createElement('button')
      optionEl.textContent = key
      optionEl.addEventListener('click', () => {
        options[key]()
      })
      this.appendChild(optionEl)
    }

    this.target.appendChild(this)
    document.body.addEventListener('click', this.hide)
  }

  hide = () => {
    this.target.removeChild(this)
    document.body.removeEventListener('click', this.hide)
  }
}

customElements.define('di-dropdown', Dropdown)