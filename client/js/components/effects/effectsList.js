import { fadeOut, flash } from '../../animationHelper.js'
import EffectRow from './effectRow.js'

export default class EffectsList extends HTMLElement{

  setFighterInstance(fighterInstance){
    this._fighterInstance = fighterInstance
    this.update(false)
  }

  update(animate = true){

    if(!this._fighterInstance){
      return
    }

    const effectRows = {}
    this.querySelectorAll('di-effect-row').forEach(row => {
      effectRows[row.getAttribute('effect-key')] = row
    })
    const expiredEffectRows = { ...effectRows }

    this._fighterInstance.state.effects.forEach(effect => {
      if(!shouldShow(effect)){
        return
      }
      const key = effect.id
      if(effectRows[key]){
        effectRows[key].update(effect, animate)
        delete expiredEffectRows[key]
      }else{
        effectRows[key] = this._addRow(key, effect, animate)
      }
    })

    Object.values(expiredEffectRows).forEach(row => this._removeRow(row, animate))
  }

  _addRow(key, effect, animate){
    const effectRow = new EffectRow(key, effect, animate)
    this.appendChild(effectRow)
    // color should be based on if buff/debuff?
    flash(effectRow)
    return effectRow
  }

  async _removeRow(row, animate){
    if(animate){
      await fadeOut(row)
    }
    row.remove()
  }
}

customElements.define('di-effects-list', EffectsList)

function shouldShow(effect){
  // Some effects shouldn't show in the list, but unclear how to designate that
  return true
}