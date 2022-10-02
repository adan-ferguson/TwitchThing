import EffectRow from './effectRow.js'

export default class EffectsList extends HTMLElement{

  setFighterInstance(fighterInstance){
    this._fighterInstance = fighterInstance
    this.update(false)
  }

  updateDurations(){
    this.update()
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

    this._fighterInstance.statusEffectsData.instances.forEach(effect => {
      if(!shouldShow(effect)){
        return
      }
      const key = effect.state.uniqueID ?? effect.data.name
      if(effectRows[key]){
        if(!effect.expired){
          effectRows[key].update(effect, animate)
          delete expiredEffectRows[key]
        }
      }else{
        effectRows[key] = this._addRow(key, effect, animate)
      }
    })

    Object.values(expiredEffectRows).forEach(row => this._removeRow(row, animate))
  }

  _addRow(key, effect, animate){
    const effectRow = new EffectRow(key, effect, animate)
    this.appendChild(effectRow)
    return effectRow
  }

  async _removeRow(row, animate){
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