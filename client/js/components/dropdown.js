export function create(options, parent){
  return new Dropdown(options, parent)
}

class Dropdown extends HTMLElement{

  constructor(parent, options){
    super()
    this.classList.add('dropdown-menu')

    for(let key in options){
      const optionEl = document.createElement('button')
      optionEl.textContent = key
      optionEl.addEventListener('click', () => {
        options[key]()
      })
      this.appendChild(optionEl)
    }

    parent.addEventListener('click', e => {
      if(this.parent){
        parent.removeChild(this)
      }else{
        parent.appendChild(this)
      }
      e.stopPropagation()
    })

    document.body.addEventListener('click', () => {
      parent.removeChild(this)
    })
  }
}

customElements.define('di-dropdown', Dropdown)