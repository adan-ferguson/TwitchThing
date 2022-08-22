import fizzetch from '../../../fizzetch.js'
import { hideLoader, showLoader } from '../../../loader.js'

const HTML = `
<div class="fill-contents">
  Output
  <textarea readonly class="output"></textarea>
</div>
<div class="fill-contents">
  Error
  <textarea readonly class="error"></textarea>
</div>
`

export default class AdminLogsTab extends HTMLElement{

  constructor(){
    super()
    this.classList.add('content-columns')
    this.innerHTML = HTML
  }

  async show(){
    showLoader('Loading logs...')
    const { errorlog, outputlog } = await fizzetch('/admin/logs')
    hideLoader()
    this.querySelector('textarea.output').textContent = outputlog
    this.querySelector('textarea.error').textContent = errorlog
  }
}

customElements.define('di-admin-logs-tab', AdminLogsTab)