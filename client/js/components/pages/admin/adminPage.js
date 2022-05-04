import Page from '../page.js'

import fizzetch from '../../../fizzetch.js'
import '../../tabz.js'
import './adventurersTab.js'
import './commandTab.js'

const HTML = `
<div class="fill-contents">
    <di-tabz>
        <di-admin-command-tab data-tab-name="Command"></di-admin-command-tab>
        <di-admin-adventurer-tab data-tab-name="Adventurer"></di-admin-adventurer-tab>
    </di-tabz>
</div>
`

export default class AdminPage extends Page{

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this._commandTab = this.querySelector('di-admin-command-tab')
    this._adventurerTab = this.querySelector('di-admin-adventurer-tab')
  }

  get titleText(){
    return 'Admin Control Panel'
  }

  async load(){

    const { adventurers, error } = await fizzetch('/admin')
    if(error){
      return error
    }

    this._adventurerTab.setAdventurers(adventurers)
  }
}

customElements.define('di-admin-page', AdminPage)