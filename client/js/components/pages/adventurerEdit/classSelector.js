import DIElement from '../../diElement.js'
import { makeEl } from '../../../../../game/utilFunctions.js'

export default class ClassSelector extends DIElement{

  _selectedClass = null

  get selectedClass(){
    return this._selectedClass
  }

  setClasses(cdis){
    this.innerHTML = ''
    this._selectedClass = null
    cdis.forEach(cdi => {
      const btn = makeEl({
        elementType: 'button',
        content: cdi.icon
      })
      btn.addEventListener('click', () => {
        this._selectedClass = cdi.name
        this.querySelector('button.selected')?.classList.remove('selected')
        btn.classList.add('selected')
        this.events.emit('select', cdi)
      })
      this.appendChild(btn)
    })
  }
}
customElements.define('di-adventurer-edit-class-selector', ClassSelector)