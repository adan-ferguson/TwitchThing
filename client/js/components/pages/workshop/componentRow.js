import DIElement from '../../diElement.js'
import classDisplayInfo from '../../../displayInfo/classDisplayInfo.js'
import AdventurerItem from '../../../../../game/items/adventurerItem.js'

const HTML = (iconEl, name, have = null, required = null) => {

  if(required !== null){
    have = Math.min(have, required)
  }

  return `
<div class="flex-columns flex-centered">
  ${iconEl}
  <span class="name">${name}</span>
</div>
<div class="flex-columns flex-centered">
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
      this.setTooltip('Acquire scrap by scrapping items in the scrapyard tab (scrap btw)')
    }else if(component.type === 'item'){
      const instance = new AdventurerItem(component.baseItemId)
      const classInfo = classDisplayInfo(component.advClass)
      const have = inventory ? (inventory.items.basic[component.baseItemId] ?? 0) : component.count
      const required = inventory ? component.count : null
      this.innerHTML = HTML(classInfo.icon, instance.displayName + ' (Basic)')
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