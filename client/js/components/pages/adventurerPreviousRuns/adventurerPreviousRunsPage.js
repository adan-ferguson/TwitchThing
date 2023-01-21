import Page from '../page.js'
import PreviousRunRow from './previousRunRow.js'

const HTML = `
<div class="content-well fill-contents">
    <di-list class="previous-runs-list"></di-list>
</div>
`

export default class AdventurerPreviousRunsPage extends Page{

  constructor(adventurerID){
    super()
    this.adventurerID = adventurerID
    this.innerHTML = HTML
  }

  static get pathDef(){
    return ['adventurer', 0, 'previousruns']
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  get titleText(){
    return this.adventurer ? (this.adventurer.name + ' - Previous Runs') : 'Huh'
  }

  async load(){
    const { adventurer, runs } = await this.fetchData()
    this.adventurer = adventurer

    const list = this.querySelector('.previous-runs-list')
      .setOptions({
        pageSize: 8
      })

    const rows = []
    runs.forEach(run => {
      rows.push(new PreviousRunRow(run))
    })
    list.setRows(rows)
  }
}

customElements.define('di-adventurer-previous-runs-page', AdventurerPreviousRunsPage)