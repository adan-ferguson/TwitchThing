import AdventurerRow from '../../adventurerRow.js'

const HTML = `
<div class="content-well fill-contents">
  <di-list></di-list>
</div>
<di-adventurer-pane></di-adventurer-pane>
`

export default class AdminAdventurerTab extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-columns')
    this.innerHTML = HTML
    this._list = this.querySelector('di-list')
    this._adventurerPane = this.querySelector('di-adventurer-pane')
  }

  setAdventurers(adventurers){
    const rows = []
    adventurers.forEach(adventurer => {
      const row = new AdventurerRow(adventurer, {
        newTab: adventurer.dungeonRunID ? '/watch/dungeonrun/' + adventurer.dungeonRunID : null
      })
      row.addEventListener('click', e => {
        this._adventurerPane.setAdventurer(adventurer)
      })
      rows.push(row)
    })
    this._list.setRows(rows)
  }
}
customElements.define('di-admin-adventurer-tab', AdminAdventurerTab)