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
    this.tabz.events.on('changing', async newTab => {
      showLoader()
      await this._loadTab(newTab)
      hideLoader()
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
    await this._loadTab(this.tabz.currentTab)
  }

  async _loadTab(tab){
    tab.innerHTML = ''
    const { data, firstTime } = await this.fetchData()
    tab.setData(data)

    if(firstTime){
      // show something?
    }
  }
}
customElements.define('di-workshop-page', WorkshopPage)