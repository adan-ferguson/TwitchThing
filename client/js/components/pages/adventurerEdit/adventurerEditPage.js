import Page from '../page.js'
import { hideLoader, showLoader } from '../../../loader.js'
import Adventurer from '../../../../../game/adventurer.js'
import { orbPointIcon, skillPointIcon } from '../../common.js'

const HTML = `
<di-tabz>
  <di-adventurer-edit-loadout-tab class="fill-contents" data-tab-name="Loadout"></di-adventurer-edit-loadout-tab>
  <di-adventurer-edit-points-tab class="fill-contents" data-tab-name="Spend Points"></di-adventurer-edit-points-tab>
<!--  <div data-tab-name="Quick Forge"></div>-->
</di-tabz>
`

export default class AdventurerEditPage extends Page{

  _saved = false

  constructor(adventurerID){
    super()
    this.innerHTML = HTML
    this.adventurerID = adventurerID
    this.tabzEl.events.on('changed', () => {
      this._loadTab()
    })
  }

  get tabzEl(){
    return this.querySelector('di-tabz')
  }

  static get pathDef(){
    return ['adventurer', 0, 'edit']
  }

  get pathArgs(){
    return [this.adventurerID]
  }

  get titleText(){
    return 'Edit'
  }

  async load(){
    const { adventurer, items } = await this.fetchData()
    this.adventurer = adventurer
    this.items = items
    this._showUnspentPoints()
    this._loadTab()
  }

  async _loadTab(){
    showLoader()
    const tab = this.tabzEl.currentTab
    await tab.showData(this)
    hideLoader()
  }

  _showUnspentPoints(){
    const ai = new Adventurer(this.adventurer)
    const unspentOrbs = ai.unspentOrbs
    const unspentSkillPoints = ai.unspentSkillPoints
    let prefixHtml = ''
    if(unspentOrbs > 0){
      prefixHtml += `<span class="unspent-points">${orbPointIcon()}${unspentOrbs}</span>`
    }
    if(unspentSkillPoints > 0){
      prefixHtml += `<span class="unspent-points">${skillPointIcon()}${unspentSkillPoints}</span>`
    }
    this.tabzEl.querySelector('.tab[data-tab-name="Spend Points"]').innerHTML = 'Spend Points' + prefixHtml
  }
}

customElements.define('di-adventurer-edit-page', AdventurerEditPage)