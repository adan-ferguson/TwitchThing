const HTML = `
<div class="inset-title"><span class="rarity"></span> Item</div>
<di-item-row></di-item-row>
<div class="stats-text"></div>
<!--<di-stats-list></di-stats-list>-->
<!--<div class='item-abilities'>&#45;&#45; TODO: add other abilities here &#45;&#45;</div>-->
`

export default class ItemDetails extends HTMLElement{

  _loadoutRow
  _statsText
  _statsList
  _abilitiesList

  constructor(itemInstance, options = {}){
    super()
    this.innerHTML = HTML
    this._loadoutRow = this.querySelector('di-loadout-row')
    // this._statsText = this.querySelector('.stats-text')
    // this._statsList = this.querySelector('di-stats-list')
    // this._statsList.setOptions({
    //   statsDisplayStyle: StatsDisplayStyle.ADDITIONAL
    // })
    // this._abilitiesList = this.querySelector('.item-abilities')

    // TODO: rarities
    this.style.color = '#000'
    this.querySelector('.inset-title .rarity').textContent = 'Normal'
    this.querySelector('di-item-row').setItem(itemInstance)

    // TODO: show stats, show description
  }
}

customElements.define('di-item-details', ItemDetails )