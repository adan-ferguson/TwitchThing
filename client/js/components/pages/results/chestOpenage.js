const HTML = `
<div class="chest-description"></div>
<di-item-details></di-item-details>
`

export default class ChestOpenage extends HTMLElement{
  contructor(chest){
    this.innerHTML = HTML
    this.querySelector('.chest-description').textContent = chest.description
    this.querySelector('di-item-details').setItem(chest.item)
  }
}

customElements.define('di-chest-openage', ChestOpenage )