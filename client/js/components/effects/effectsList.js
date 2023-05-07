import EffectRow from './effectRow.js'
import { statusEffectDisplayInfo } from '../../displayInfo/statusEffectDisplayInfo.js'

export default class EffectsList extends HTMLElement{

  setFighterInstance(fighterInstance){
    this._fighterInstance = fighterInstance
    this.update(false)
  }

  update(cancelAnimations = false){

    if(!this._fighterInstance){
      return
    }

    const effectRows = {}
    this.querySelectorAll('di-effect-row').forEach(row => {
      effectRows[row.getAttribute('effect-key')] = row
    })
    const expiredEffectRows = { ...effectRows }

    this._fighterInstance.statusEffectInstances.forEach(sei => {
      const sedi = statusEffectDisplayInfo(sei)
      if(!sedi){
        return
      }
      const key = sei.uniqueID
      if(effectRows[key]){
        if(!sei.expired){
          effectRows[key].update(sei, cancelAnimations)
          delete expiredEffectRows[key]
        }
      }else{
        effectRows[key] = this._addRow(key, sei)
      }
    })

    Object.values(expiredEffectRows).forEach(row => this._removeRow(row))
  }

  advanceTime(ms){
    this.querySelectorAll('di-effect-row').forEach(row => {
      row.advanceTime(ms)
    })
  }

  _addRow(key, effect){
    const effectRow = new EffectRow().setEffect(effect, key)
    this.appendChild(effectRow)
    return effectRow
  }

  async _removeRow(row){
    row.remove()
  }
}

customElements.define('di-effects-list', EffectsList)

function shouldShow(effect){
  if(effect.expired){
    return false
  }
  return true
}