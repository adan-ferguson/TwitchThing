import Page from '../page.js'
import { hideLoader, showLoader } from '../../../loader.js'

const HTML = `
<di-tabz>
  <di-workshop-forge data-tab-name="Upgrader"></di-workshop-forge>
  <di-workshop-scrapyard data-tab-name="Scrapyard"></di-workshop-scrapyard>
</di-tabz>
`

export default class WorkshopPage extends Page{

  constructor({ initialAdventurerID }){
    super()
    this.innerHTML = HTML
    this._initialAdventurerID = initialAdventurerID
    this.tabz.events.on('changed', () => {
      this._loadTab()
    })
  }

  static get pathDef(){
    return ['workshop']
  }

  /**
   * @returns {Tabz}
   */
  get tabz(){
    return this.querySelector('di-tabz')
  }

  async load(){
    this._loadTab(true)
  }

  async _loadTab(first = false){
    showLoader()
    const tab = this.tabz.currentTab
    tab.innerHTML = ''
    await tab.load(first ? this._initialAdventurerID : null)
    hideLoader()
  }
}
customElements.define('di-workshop-page', WorkshopPage)