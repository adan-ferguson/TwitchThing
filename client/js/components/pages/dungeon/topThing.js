import DIElement from '../../diElement.js'
import { toDisplayName } from '../../../../../game/utilFunctions.js'

export default class TopThing extends DIElement{

  updateEvent(event){
    this._setColor(null)
    this.innerHTML = toDisplayName(event.roomType) || 'Wandering'
  }

  update(str, color){
    this.innerHTML = str
    this.style.color = color
  }

  _setColor(color){
    this.style.color = color
  }
}
customElements.define('di-top-thing', TopThing)