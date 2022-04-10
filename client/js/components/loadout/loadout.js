import LoadoutRow from './loadoutRow.js'
import orb from '/client/assets/icons/orb.svg'
import OrbsData from '../../../../game/orbsData.js'

const HTML = `
<div class="flex-rows">
  <div class="orb-row"><img alt="Orbs" src="${orb}"> <span class="orbs-text"></span></div>
  <di-list></di-list>
</div>
`

export const OrbsDisplayStyles = {
  STANDARD: 0,
  SHOW_MAXIMUM: 1
}

export default class Loadout extends HTMLElement{

  constructor(){
    super()
    this.innerHTML = HTML
    this.classList.add('fill-contents')

    this.orbsText = this.querySelector('.orbs-text')
    this.list = this.querySelector('di-list')
    this.list.setOptions({
      paginate: false,
      pageSize: 8
    })

    this._options = {
      orbsDisplay: OrbsDisplayStyles.STANDARD,
      editable: false
    }

    this.items = []
    this._updateRows()
  }

  get orbsData(){
    if(this.adventurer && this.items){
      return new OrbsData(this.adventurer, this.items)
    }
    return null
  }

  setOptions(options = {}){
    for (let key in options){
      this._options[key] = options[key]
    }
    this._update()
    return this
  }

  setAdventurer(adventurer){
    this.adventurer = adventurer
    this._originalItems = adventurer.loadout.slice()
    this.items = this._originalItems
    this._updateRows()
    this._update()
  }

  isValid(){
    // TODO: other checks
    return this.orbsData.isValid ? true : false
  }

  hasChanges(){
    for(let i = 0; i < 8; i++){
      if(this._originalItems[i] !== this.items[i]){
        return true
      }
    }
    return false
  }

  _updateRows(){
    const rows = []
    for(let i = 0; i < 8; i++){
      const item = this.items[i] || null
      if(item){
        rows[i] = new LoadoutRow(item)
      }
    }
    this.list.setItems(rows)
  }

  _update(){
    if(!this.adventurer){
      return
    }

    const orbsData = this.orbsData

    if(this._options.orbsDisplayStyle === OrbsDisplayStyles.STANDARD){
      this.orbsText.textContent = '' + orbsData.used
    }else if(this._options.orbsDisplayStyle === OrbsDisplayStyles.SHOW_MAXIMUM){
      this.orbsText.textContent = `${orbsData.used}/${orbsData.max}`
    }
  }
}

customElements.define('di-loadout', Loadout)