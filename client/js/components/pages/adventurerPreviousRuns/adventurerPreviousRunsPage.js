import Page from '../page.js'
import AdventurerPage from '../adventurer/adventurerPage.js'
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

  get titleText(){
    return this.adventurer ? '' : this.adventurer.name + ' - Previous Runs'
  }

  get backPage(){
    return () => new AdventurerPage(this.adventurerID)
  }

  async load(_){
    const { adventurer, runs } = await this.fetchData(`/game/adventurer/${this.adventurerID}/previousruns`)
    this.adventurer = adventurer

    const list = this.querySelector('.previous-runs-list')
    const rows = []
    runs.forEach(run => {
      const row = new PreviousRunRow(run)
      row.addEventListener('click', e => {
        this.redirectTo(row.targetPage)
      })
      rows.push(row)
    })
    list.setRows(rows)
  }
}

customElements.define('di-adventurer-previous-runs-page', AdventurerPreviousRunsPage)