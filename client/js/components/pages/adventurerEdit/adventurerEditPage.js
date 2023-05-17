import Page from '../page.js'
import { hideLoader, showLoader } from '../../../loader.js'
import Adventurer from '../../../../../game/adventurer.js'
import { orbPointEntry, skillPointEntry } from '../../common.js'
import tippyCallout from '../../visualEffects/tippyCallout.js'

const HTML = `
<di-tabz>
  <di-adventurer-loadout-tab class="fill-contents" data-tab-name="Loadout"></di-adventurer-loadout-tab>
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
    this.adventurer = new Adventurer(adventurer)
    this.items = items
    this.updatePoints()
    this._loadTab()
  }

  async _loadTab(){
    showLoader()
    const tab = this.tabzEl.currentTab
    await tab.showData(this)
    hideLoader()
  }

  updatePoints(){
    const tab = this.tabzEl.querySelector('.tab[data-tab-name="Spend Points"]')
    if(!this.user.features.spendPoints){
      tab.classList.add('displaynone')
      return
    }
    if(this.user.features.spendPoints === 1){
      tab.classList.add('glow')
      tippyCallout(tab, 'Assign orbs here')
    }
    const unspentOrbs = this.adventurer.unspentOrbs
    const unspentSkillPoints = this.adventurer.unspentSkillPoints
    let prefixHtml = ' '
    if(unspentOrbs > 0){
      prefixHtml += orbPointEntry(unspentOrbs)
    }
    if(unspentSkillPoints > 0){
      prefixHtml += skillPointEntry(unspentSkillPoints)
    }
    tab.innerHTML = 'Spend Points' + prefixHtml
  }
}

customElements.define('di-adventurer-edit-page', AdventurerEditPage)