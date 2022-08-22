const HTML = `
<div class="overlay"></div>
<div class="middle">
    <div class="message"></div>
    <div class="spin-effect spinner">DI</div>
</div>
`

export default class Loader extends HTMLElement{
  constructor(){
    super()
    this.innerHTML = HTML
  }

  show(){
    this.classList.add('show')
  }

  hide(){
    this.classList.remove('show')
  }
}

customElements.define('di-loader', Loader)