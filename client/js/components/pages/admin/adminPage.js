import Page from '../page.js'

import '../../tabz.js'
import './adventurersTab.js'
import './commandTab.js'

const HTML = `
<div class="fill-contents">
    <di-tabz>
        <di-admin-command-tab data-tab-name="Command"></di-admin-command-tab>
        <di-admin-adventurer-tab data-tab-name="Adventurers"></di-admin-adventurer-tab>
        <di-admin-logs-tab data-tab-name="View Logs"></di-admin-logs-tab>
        <di-admin-performance-tab data-tab-name="Performance"></di-admin-performance-tab>
    </di-tabz>
</div>
`

export default class AdminPage extends Page{

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
  }

  static get pathDef(){
    return ['admin']
  }

  get titleText(){
    return 'Admin Control Panel'
  }

  async load(){
    await this.fetchData()
  }

  unload(){
    this.querySelector('di-tabz').unloadTab()
  }
}

customElements.define('di-admin-page', AdminPage)