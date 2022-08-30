import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import Page from '../page.js'

const HTML = `
<div class="content-well">
  <di-live-dungeon-map></di-live-dungeon-map>
</div>
`
export default class LiveDungeonMapPage extends Page{

  _liveDungeonMapEl

  constructor(){
    super()
    this.innerHTML = HTML
    this._liveDungeonMapEl = this.querySelector('di-live-dungeon-map')
  }

  static get pathDef(){
    return ['livedungeonmap']
  }

  async load(_){
    const { activeRuns } = await this.fetchData()
    joinSocketRoom('live dungeon map')
    getSocket().on('live dungeon map update', this._updateRuns)
    this._updateRuns(activeRuns)
  }

  async unload(){
    leaveSocketRoom('live dungeon map')
    getSocket().off('live dungeon map update', this._updateRuns)
  }

  _updateRuns = (dungeonRuns) => {
    dungeonRuns.forEach(run => {
      this._liveDungeonMapEl.updateRun(run)
    })
  }

}
customElements.define('di-live-dungeon-map-page', LiveDungeonMapPage)