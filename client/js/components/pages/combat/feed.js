const HTML = `
<div class='text-feed'></div>
`

export default class Feed extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.textFeed = this.querySelector('.text-feed')
  }

  setText(text){
    if(!text){
      return
    }
    this.textFeed.textContent = text
  }

}

customElements.define('di-combat-feed', Feed )