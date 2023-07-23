import { getSocket, joinSocketRoom, leaveSocketRoom } from '../../../socketClient.js'
import fizzetch from '../../../fizzetch.js'

const HTML = `
<div class="workers"></div>
<span class="queue-length"></span>
<ul class="cancelled-runs"></ul>
<button class="purge">Purge Cancelled</button>
`

export default class AdminPerformanceTab extends HTMLElement{

  constructor(){
    super()
  }

  async show(){
    this.innerHTML = HTML
    const fiz = await fizzetch('/game/admin/performance')
    this._updateWorkers(fiz)
    joinSocketRoom('admin performance tab')
    getSocket().on('admin update workers', this._updateWorkers)

    this._showCancelledRuns(fiz.cancelledRuns)
    this.querySelector('button.purge').addEventListener('click', () => {
      fizzetch('/game/admin/purgecancelled')
      this.querySelector('ui.cancelled-runs').innerHTML = ''
    })
  }

  unload(){
    leaveSocketRoom('admin performance tab')
    getSocket().off('admin update workers', this._updateWorkers)
  }

  _updateWorkers = ({ workers, queueLength }) => {
    this.querySelector('.workers').innerHTML = workers.map(w => {
      return `<div class="worker ${w ? 'worker-busy' : ''}"></div>`
    }).join('')
    this.querySelector('.queue-length').textContent = queueLength
  }

  _showCancelledRuns(runs){
    const list = this.querySelector('ul.cancelled-runs')
    list.innerHTML = runs.map(r => `<li><a href="/game/dungeonrun/${r._id}">${r._id}</a></li>`)
  }
}

customElements.define('di-admin-performance-tab', AdminPerformanceTab)