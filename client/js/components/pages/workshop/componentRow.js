import DIElement from '../../diElement.js'
import AdventurerItemInstance from '../../../../../game/adventurerItemInstance.js'
import classDisplayInfo from '../../../classDisplayInfo.js'

const HTML = (iconEl, name, have = 0, required = 0) => {

  have = Math.min(have, required)

  let html = `
<div class="flex-columns-center">
  ${iconEl}
  <span class="name">${name}</span>
</div>
`

  if(required){
    html += `
<div class="flex-columns-center">
  <span class="count-tab">${have}/${required}</span>
</div>
    `
  }

  return html
}

export default class ComponentRow extends DIElement{
  setData(component, inventory){
    if(component.type === 'scrap'){
      this._update('<i class="fa-solid fa-recycle component-icon"></i>', 'Scrap', inventory.scrap, component.count)
    }else if(component.type === 'item'){
      const instance = new AdventurerItemInstance(component.itemDef)
      const classInfo = classDisplayInfo(component.itemDef.group)
      const invCount = inventory.items.basic[component.itemDef.group]?.[component.itemDef.name] ?? 0
      this.innerHTML = HTML(`<img class="component-icon" src="${classInfo.orbIcon}">`,
        instance.displayName, invCount, component.count)
    }
    return this
  }

  _update(iconHTML, name, have, required){
    this.innerHTML = HTML(iconHTML, name, have, required)
    this.classList.toggle('not-enough', have < required)
  }
}
customElements.define('di-workshop-component-row', ComponentRow)