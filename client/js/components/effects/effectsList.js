import EffectRow from './effectRow.js'

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

    this._fighterInstance.statusEffectsData.instances.forEach(effect => {
      if(!shouldShow(effect)){
        return
      }
      const key = effect.effectId
      if(effectRows[key]){
        if(!effect.expired){
          effectRows[key].update(effect, cancelAnimations)
          delete expiredEffectRows[key]
        }
      }else{
        effectRows[key] = this._addRow(key, effect)
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
    const effectRow = new EffectRow(key, effect)
    this.appendChild(effectRow)
    return effectRow
  }

  async _removeRow(row){
    row.remove()
  }
}

customElements.define('di-effects-list', EffectsList)

function shouldShow(effect){
  if(effect.phantom){
    return false
  }
  if(effect.expired){
    return false
  }
  return true
}