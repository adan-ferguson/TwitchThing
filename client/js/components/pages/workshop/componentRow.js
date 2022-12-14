import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import classDisplayInfo from '../../../classDisplayInfo.js'

const HTML = (iconEl, name, have = null, required = null) => {

  if(required !== null){
    have = Math.min(have, required)
  }

  return `
<div class="flex-columns-center">
  ${iconEl}
  <span class="name">${name}</span>
</div>
<div class="flex-columns-center">
  <span class="count-tab"></span>
</div>
`
}

export default class ComponentRow extends DIElement{

  setData(component, inventory = null){
    if(component.type === 'scrap'){
      const have = inventory ? inventory.scrap : component.count
      const required = inventory ? component.count : null
      this.innerHTML = HTML('<i class="fa-solid fa-recycle component-icon"></i>', 'Scrap')
      this.setValue(have, required)
    }else if(component.type === 'item'){
      const instance = new AdventurerItemInstance(component.itemDef)
      const classInfo = classDisplayInfo(component.itemDef.group)
      const have = inventory ? (inventory.items.basic[component.itemDef.group]?.[component.itemDef.name] ?? 0) : component.count
      const required = inventory ? component.count : null
      this.innerHTML = HTML(`<img class="component-icon" src="${classInfo.orbIcon}">`, 'Lvl. 1 ' + instance.displayName)
      this.setValue(have, required)
    }
    return this
  }

  setValue(have, required = null){
    this.querySelector('.count-tab').textContent = countStr(have, required)
    this.classList.toggle('not-enough', required && have < required)
  }

}
customElements.define('di-workshop-component-row', ComponentRow)

function countStr(have, required){
  return required ? `${have}/${required}` : have
}