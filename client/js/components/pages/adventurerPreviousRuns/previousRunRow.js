import DungeonPage from '../dungeon/dungeonPage.js'

const HTML = `

`

export default class PreviousRunRow extends HTMLElement{

  _run

  constructor(run){
    super()
    this._run = run
    this.innerHTML = HTML
  }

  get targetPage(){
    return new DungeonPage(this._run.dungeonRunID)
  }

}

customElements.define('di-previous-run-row', PreviousRunRow)