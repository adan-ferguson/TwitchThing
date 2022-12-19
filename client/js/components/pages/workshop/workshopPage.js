import Page from '../page.js'
import { hideLoader, showLoader } from '../../../loader.js'

const HTML = `
<di-tabz>
  <di-workshop-forge data-tab-name="Forge"></di-workshop-forge>
  <di-workshop-scrapyard data-tab-name="Scrapyard"></di-workshop-scrapyard>
</di-tabz>
`

export default class WorkshopPage extends Page{

  constructor(){
    super()
    this.innerHTML = HTML
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
    this._loadTab()
  }

  async _loadTab(){
    showLoader()
    const tab = this.tabz.currentTab
    tab.innerHTML = ''
    await tab.load()
    hideLoader()

    // if(firstTime){
    //   // show something?
    // }
  }
}
customElements.define('di-workshop-page', WorkshopPage)