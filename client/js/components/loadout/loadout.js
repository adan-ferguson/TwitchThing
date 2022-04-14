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

    this._rows = []
    for(let i = 0; i < 8; i++){
      this._rows[i] = new LoadoutRow(i)
    }

    this._update()
  }

  get items(){
    return this._rows.map(row => row.item)
  }

  get orbsData(){
    return OrbsData.fromFighter(this._fighter)
  }

  get hasChanges(){
    for(let i = 0; i < 8; i++){
      if(this._originalItems[i] !== this.items[i]){
        return true
      }
    }
    return false
  }

  setOptions(options = {}){
    for (let key in options){
      this._options[key] = options[key]
    }
    this._update()
    return this
  }

  setFighter(fighter){
    this._fighter = fighter
    this._originalItems = [...fighter.items]
    for(let i = 0; i < 8; i++){
      this._rows[i].setItem(this._originalItems[i])
    }
    this._update()
  }

  get isValid(){
    // TODO: other checks
    return this.orbsData.isValid ? true : false
  }

  get isFull(){
    return this._rows.every(row => row.item)
  }

  addItem(item){
    for(let i = 0; i < 8; i++){
      if(!this.items[i]){
        this._rows[i].setItem(item, i)
        this._update()
        return true
      }
    }
    return false
  }

  setItem(index, item){
    this._rows[index].setItem(item)
    this._update()
  }

  swap(index1, index2){
    const item1 = this._rows[index1].item
    this._rows[index1].setItem(this._rows[index2].item)
    this._rows[index2].setItem(item1)
    this._update()
  }

  _update(){

    const orbsData = this.orbsData

    if(this._options.orbsDisplayStyle === OrbsDisplayStyles.STANDARD){
      this.orbsText.textContent = '' + orbsData.used
    }else if(this._options.orbsDisplayStyle === OrbsDisplayStyles.SHOW_MAXIMUM){
      this.orbsText.textContent = `${orbsData.used}/${orbsData.max}`
      this.orbsText.classList.toggle('error', orbsData.remaining < 0)
    }

    this.list.setRows(this._rows)
  }
}

customElements.define('di-loadout', Loadout)