const HTML = `
<div class="obj-border">
  <span class="inset-title item-name"></span>
  <di-effect-details></di-effect-details>
</div>
`

export default class MonsterItemCard extends HTMLElement{

  get orbEl(){
    return this.querySelector('.item-orbs')
  }

  get nameEl(){
    return this.querySelector('.item-name')
  }

  get loadoutObjectDetails(){
    return this.querySelector('di-effect-details')
  }

  setItem(monsterItem){
    this.innerHTML = HTML
    if (!monsterItem){
      return
    }
    this.nameEl.textContent = monsterItem.displayName
    this.loadoutObjectDetails.setObject(monsterItem)
    return this
  }
}

customElements.define('di-monster-item-card', MonsterItemCard)